## Setup

1. ```bash
   npm install
   ```
2. fill up privateKey.txt
3. run bot

## Features

1. auto swap
2. send faucet to another wallet
3. mint token

## Commands

- Generating a wallet

1.  go to generate.wallet.js then set the amount of wallet that you wanted to generate
2.  then run this code on console

```bash
   npm run generate
```

- Minting token

1.  ```bash
        npm run mint
    ```

- Sending faucet to all wallet

1. first go to .env then fill this with your wallet private key that has the faucet

   ```bash
   treasury_wallet_key=
   ```

2. then run this command

```bash
       npm run send
```

## notes

for now it only support minting and swapping from teko finance,
ill add more in the future
