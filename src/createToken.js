// src/createToken.js
import 'dotenv/config';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes/index.js';
import fetch, { FormData, Blob } from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    // ─── 1. Load your wallet ───────────────────────────────────────────────────
    const pk = process.env.PRIVATE_KEY;
    if (!pk) throw new Error('🛑 PRIVATE_KEY not set in .env');
    const wallet = Keypair.fromSecretKey(bs58.decode(pk));
    console.log('🔑 Wallet:', wallet.publicKey.toBase58());

    // ─── 2. Read token.json ───────────────────────────────────────────────────
    const tokenJsonPath = path.resolve(process.cwd(), 'token.json');
    const raw = await fs.promises.readFile(tokenJsonPath, 'utf8');
    const token = JSON.parse(raw);

    // ─── 3. Upload metadata to IPFS ──────────────────────────────────────────
    //   Create a Blob from your image file (mimics fs.openAsBlob)
    const imagePath = path.resolve(process.cwd(), token.image);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`🛑 Image not found at ${imagePath}`);
    }
    const fileBuffer = await fs.promises.readFile(imagePath);
    const blob = new Blob([fileBuffer]);

    //   Build the FormData exactly like your example
    const formData = new FormData();
    formData.append('file', blob, path.basename(imagePath));  // Image
    formData.append('name',        token.name);
    formData.append('symbol',      token.symbol);
    formData.append('description', token.description);
    if (token.twitter)  formData.append('twitter',  token.twitter);
    if (token.telegram) formData.append('telegram', token.telegram);
    if (token.website)  formData.append('website',  token.website);
    formData.append('showName', token.showName ? 'true' : 'false');

    console.log('☁️  Uploading metadata to IPFS…');
    const ipfsRes = await fetch('https://pump.fun/api/ipfs', {
      method: 'POST',
      body:   formData
    });
    if (!ipfsRes.ok) {
      const errText = await ipfsRes.text();
      throw new Error(`IPFS upload failed (${ipfsRes.status}): ${errText}`);
    }
    const ipfsJson = await ipfsRes.json();
    console.log('✔️  IPFS response:', ipfsJson);

    // ─── 4. Prepare create-token params ────────────────────────────────────────
    const { metadataUri, metadata } = ipfsJson;
    const param = {
      wallet_address: wallet.publicKey.toBase58(),
      name:           metadata.name,
      symbol:         metadata.symbol,
      metadataUri,
      amount:         token.amount,
      slippage:       token.slippage,
      tip:            token.tip,
      type:           'jito'
    };
    console.log('📦 Create-token payload:', param);

    // ─── 5. Request the base64 transaction ────────────────────────────────────
    const createUrl = 'https://api.solanaportal.io/api/create/token/pumpfun';
    console.log('🔗 POST →', createUrl);
    const createRes = await fetch(createUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(param)
    });
    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Create-token failed (${createRes.status}): ${errText}`);
    }
    const b64 = await createRes.text();
    console.log('✔️  Received base64 Tx');

    // ─── 6. Decode, sign & re-encode ──────────────────────────────────────────
    const buffer = Buffer.from(b64, 'base64');
    const txn    = VersionedTransaction.deserialize(buffer);
    txn.sign([wallet]);
    const signed = bs58.encode(txn.serialize());

    // ─── 7. Send signed transaction via Jito ──────────────────────────────────
    console.log('🚀 Sending signed transaction to Jito…');
    const jitoRes = await fetch(
      'https://tokyo.mainnet.block-engine.jito.wtf/api/v1/transactions',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          jsonrpc: '2.0',
          id:      1,
          method:  'sendTransaction',
          params:  [signed]
        })
      }
    );
    const jitoJson = await jitoRes.json();
    if (jitoRes.ok) {
      console.log(`✅ Transaction successful! https://solscan.io/tx/${jitoJson.result}`);
    } else {
      console.error('❌ Jito submission failed:', jitoJson);
    }

  } catch (err) {
    console.error('🛑 Error:', err.message);
  }
}

main();
