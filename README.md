# SolanaPortal PumpFun API

This repository contains a simple Node.js CLI bot that uses the SolanaPortal PumpFun API to buy and sell SPL tokens on Solana via Jito’s RPC endpoint.

---

## 🚀 How the PumpFun API Works

SolanaPortal’s `/api/trading` endpoint builds and returns a base64-encoded transaction for a PumpFun swap. You submit this payload along with your parameters, sign it locally, and then send it to Solana via Jito.

### Endpoint

```
POST https://api.solanaportal.io/api/trading
```

### Required Parameters

| Field            | Type     | Description                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------- |
| `wallet_address` | `string` | Your Solana wallet public key (Base58).                                          |
| `action`         | `string` | Either `"buy"` or `"sell"`.                                                      |
| `dex`            | `string` | Always `"pumpfun"` for this script.                                              |
| `mint`           | `string` | The mint address of the token to trade (Base58).                                 |
| `amount`         | `number` | If buying: the amount of SOL to spend. If selling: the amount of tokens to sell. |
| `slippage`       | `number` | Maximum price impact tolerance as a percent (integer between 1 and 100).         |
| `tip`            | `number` | Jito tip in SOL (e.g. `0.0001`).                                                 |
| `type`           | `string` | Always `"jito"` in this implementation.                                          |

### Response

* **200 OK**: Returns a base64 string representing a VersionedTransaction.
* **Error**: Non-200 response with error text in the body.

---

## 📝 Signing & Submitting Transactions

1. Decode base64 payload to a `VersionedTransaction`.

2. Sign locally using your `PRIVATE_KEY` (loaded from `.env`).

3. Encode the signed transaction to Base58.

4. Submit via Jito’s RPC endpoint:

   ```http
   POST https://tokyo.mainnet.block-engine.jito.wtf/api/v1/transactions
   Content-Type: application/json

   {
     "jsonrpc": "2.0",
     "id": 1,
     "method": "sendTransaction",
     "params": [ "<SIGNED_TRANSACTION_BASE58>" ]
   }
   ```

5. On success, Jito returns a transaction signature you can view on Solscan.

---

## 💻 Code Overview

The main script is located at `src/index.js`:

```js
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes/index.js";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import fetch from "node-fetch";
import { config as configDotenv } from "dotenv";
import readline from "readline/promises";
import { stdin, stdout } from "process";

configDotenv();

async function main() {
  // 1. Prompt user: buy/sell
  // 2. Prompt mint, amount, slippage, tip
  // 3. Call SolanaPortal API
  // 4. Deserialize, sign, and serialize transaction
  // 5. Submit via Jito
  // 6. Log success or error
}

main();
```

Key points:

* Uses `dotenv` to load `PRIVATE_KEY` and `RPC_URL`.
* Uses Node’s `readline/promises` for a simple CLI.
* Ensures ESM mode (`"type": "module"` in `package.json`).

---

## 📦 Installation & Running

1. **Clone** this repository:

   ```bash
   git clone https://github.com/Rashadkhan2/pumpfun-api
   cd solanaportal-pumpfun-api
   ```

2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Configure** environment variables in a `.env` file at the project root:

   ```dotenv
   PRIVATE_KEY=<your_base58_secret_key>
   RPC_URL=https://tokyo.mainnet.block-engine.jito.wtf/api/v1/transactions
   ```

4. **Run** the bot:

   ```bash
   npm start
   ```

5. **Follow prompts** to buy or sell tokens.

---

## 💸 Buying & Selling

1. **Action**: Choose `buy` or `sell`.
2. **Mint**: Provide the token’s mint address.
3. **Amount**:

   * If `buy`: enter amount of SOL.
   * If `sell`: enter amount of tokens.
4. **Slippage**: Enter tolerance (1–100%).
5. **Tip**: Enter Jito tip in SOL (e.g. `0.0001`).

After you confirm, the bot:

* Builds and signs a transaction.
* Sends it through Jito’s RPC.
* Prints a Solscan link on success.

---

## 📚 Further Reading

For full SolanaPortal PumpFun API docs, visit:

> [https://docs.solanaportal.io](https://docs.solanaportal.io)
