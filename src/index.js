import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes/index.js";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import fetch from "node-fetch";
import { config as configDotenv } from "dotenv";
import readline from "readline/promises";
import { stdin, stdout } from "process";

// If you're running in ESM mode, ensure your package.json includes
// { "type": "module" } or rename to .mjs

// Load environment variables
configDotenv();
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RPC_URL = process.env.RPC_URL || "";

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  console.log("=== SolanaPortal BOT API ===");
  const actionInput = await rl.question("Do you want to buy or sell? (buy/sell): ");
  const action = actionInput.trim().toLowerCase();
  if (action !== "buy" && action !== "sell") {
    console.error("Invalid action. Please enter 'buy' or 'sell'.");
    rl.close();
    return;
  }

  const mint = await rl.question(
    action === "buy"
      ? "Enter MINT CA of the token you want to buy: "
      : "Enter MINT CA of the token you want to sell: "
  );

  const amountInput = await rl.question(
    action === "buy"
      ? "Enter amount in SOL to spend: "
      : "Enter amount in tokens to sell: "
  );
  const amount = parseFloat(amountInput);
  if (isNaN(amount)) {
    console.error("Invalid amount.");
    rl.close();
    return;
  }

  const slippageInput = await rl.question("Provide slippage tolerance (1-100): ");
  const slippage = parseInt(slippageInput, 10);
  if (isNaN(slippage) || slippage < 1 || slippage > 100) {
    console.error("Invalid slippage.");
    rl.close();
    return;
  }

  const tipInput = await rl.question("Enter Jito TIP amount (e.g. 0.0001): ");
  const tip = parseFloat(tipInput);
  if (isNaN(tip) || tip <= 0) {
    console.error("Invalid tip amount.");
    rl.close();
    return;
  }

  rl.close();

  try {
    const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    console.log("Wallet:", wallet.publicKey.toBase58());

    const params = {
      wallet_address: wallet.publicKey.toBase58(),
      action,
      dex: "pumpfun",
      mint: mint.trim(),
      amount,
      slippage,
      tip,
      type: "jito"
    };

    const tradeResponse = await fetch("https://api.solanaportal.io/api/trading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });

    if (tradeResponse.status !== 200) {
      console.error("Trading API error:", tradeResponse.statusText);
      return;
    }

    const txBase64 = await tradeResponse.text();
    const txBuffer = Buffer.from(txBase64, "base64");
    const tx = VersionedTransaction.deserialize(txBuffer);
    tx.sign([wallet]);
    const signedTx = bs58.encode(tx.serialize());

    const jitoResponse = await fetch(
      "https://tokyo.mainnet.block-engine.jito.wtf/api/v1/transactions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [signedTx]
        })
      }
    );

    if (jitoResponse.status === 200) {
      const { result: signature } = await jitoResponse.json();
      console.log(
        `Transaction to ${action} ${mint.trim()} for ${amount} successful: https://solscan.io/tx/${signature}`
      );
    } else {
      console.error("Transaction failed, please try again", await jitoResponse.text());
    }
  } catch (err) {
    console.error("Error:", err.message || err);
  }
}

main();
