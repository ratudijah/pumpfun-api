# SolanaPortal PumpFun API

A simple Node.js CLI bot that uses SolanaPortal’s PumpFun API to:

- **Swap SPL tokens** (buy/sell) via Jito’s RPC  
- **Create your own PumpFun mint** (metadata upload + on-chain mint)  

Everything runs locally in ESM mode, with transactions built by SolanaPortal, signed in your wallet, and sent through Jito for max speed.

---

## 🚀 How the Trading (Buy/Sell) API Works

### Endpoint

```
POST https://api.solanaportal.io/api/trading
```

### Request Parameters

| Field            | Type     | Description                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------- |
| `wallet_address` | `string` | Your Solana wallet public key (Base58).                                          |
| `action`         | `string` | `"buy"` or `"sell"`.                                                             |
| `dex`            | `string` | `"pumpfun"`.                                                                     |
| `mint`           | `string` | The token mint address (Base58).                                                 |
| `amount`         | `number` | SOL amount to spend (buy) or token amount to sell.                               |
| `slippage`       | `number` | Max price impact tolerance (%) between 1–100.                                    |
| `tip`            | `number` | Jito tip in SOL (e.g. `0.0001`).                                                  |
| `type`           | `string` | `"jito"` (this implementation).                                                  |

### Response

- **200 OK**  
  Returns a base64-encoded `VersionedTransaction` for you to decode/sign/submit.
- **Error**  
  Non-200 status with error details in the response body.

---

## 📚 Token Creation (Mint) API

PumpFun lets you deploy your own SPL token + first liquidity in one command:

1. **Save** your token info in `token.json` (name, symbol, description, image path, and other metadata).  
2. **Upload** Metadata + Image to IPFS via PumpFun’s IPFS endpoint.  
3. **Request** a “create token” transaction from SolanaPortal.  
4. **Sign** it locally.  
5. **Send** via Jito RPC.  
6. **Log** the Solscan URL on success.

> **Note:** The script reads your metadata from `token.json` first, so be sure to configure it before running.

### 1. IPFS Metadata Upload

```
POST https://pump.fun/api/ipfs
```

**FormData fields**:

| Field         | Type         | Description                   |
| ------------- | ------------ | ----------------------------- |
| `file`        | Binary image | PNG/JPG token logo            |
| `name`        | `string`     | Token name (e.g. “My Token”)  |
| `symbol`      | `string`     | Token symbol (e.g. “MTK”)     |
| `description` | `string`     | Token description             |
| `twitter`     | `string`     | (optional) Twitter URL        |
| `telegram`    | `string`     | (optional) Telegram URL       |
| `website`     | `string`     | (optional) Website URL        |
| `showName`    | `string`     | `"true"` to display on UI     |

**Response**:

```json
{
  "metadataUri": "https://…/metadata.json",
  "metadata": {
    "name": "My Token",
    "symbol": "MTK",
    "…": "…"
  }
}
```

### 2. Create-Token API

```
POST https://api.solanaportal.io/api/create/token/pumpfun
```

**JSON body**:

| Field            | Type     | Description                                            |
| ---------------- | -------- | ------------------------------------------------------ |
| `wallet_address` | `string` | Your wallet public key.                                |
| `name`           | `string` | Must match `metadata.name`.                            |
| `symbol`         | `string` | Must match `metadata.symbol`.                          |
| `metadataUri`    | `string` | URI returned from IPFS step.                           |
| `amount`         | `number` | SOL to pay for initial mint (e.g. `0.01`).             |
| `slippage`       | `number` | % slippage tolerance (1–100).                          |
| `tip`            | `number` | Jito tip in SOL (e.g. `0.0005`).                       |
| `type`           | `string` | `"jito"`.                                              |

**Response**:

- **200 OK**:  
  Returns a base64 string (the unsigned transaction).  
- **Post-Sign**:  
  After signing and sending via Jito, your script will log:

  ```
  txn succeed: https://solscan.io/tx/<TX_SIGNATURE>
  ```

---

## 💻 Code Overview

### `src/index.js` – Trading CLI

1. Prompts: **buy/sell** → **mint** → **amount** → **slippage** → **tip**  
2. Calls `/api/trading` → deserializes & signs → sends via Jito  
3. Prints Solscan link on success  

### `src/createToken.js` – Token Creation

1. Reads **`token.json`** for metadata & local image path  
2. Uploads logo + metadata to `https://pump.fun/api/ipfs`  
3. Calls SolanaPortal create-token endpoint  
4. Signs & sends via Jito  
5. Logs:

   ```
   txn succeed: https://solscan.io/tx/<TX_SIGNATURE>
   ```

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/solanaportal-pumpfun-api.git
cd solanaportal-pumpfun-api
npm install
```

### Environment Variables

Create a `.env` in project root:

```dotenv
PRIVATE_KEY=<your_base58_secret_key>
RPC_URL=https://tokyo.mainnet.block-engine.jito.wtf/api/v1/transactions
```

---

## 🚀 Running

- **Trading Bot**  
  ```bash
  npm start
  ```  

- **Create Token**  
  ```bash
  npm run create-token
  ```

---

## 🔧 Configuration Files

### `token.json`

Place alongside `/src` and your `.env`. Example:

```json
{
  "name": "SolanaPortal",
  "symbol": "SPA",
  "description": "Testing SolanaPortal API for pumpfun token creation",
  "image": "./token.png",
  "twitter": "https://docs.solanaportal.io",
  "telegram": "https://docs.solanaportal.io",
  "website": "https://docs.solanaportal.io",
  "showName": true,
  "amount": 0.01,
  "slippage": 100,
  "tip": 0.0005
}
```

- **`image`**: Path to your PNG/JPG logo  
- **`amount`**: SOL to fund the mint  
- **`slippage`**/**`tip`**: As in the tables above  

---

## 💸 Usage

1. **`npm start`** → follow prompts to **buy** or **sell**.  
2. **`npm run create-token`** → mints your own token with initial SOL.  

---

## 📚 Further Reading

Full SolanaPortal PumpFun docs:  
👉 https://docs.solanaportal.io
