const Wallet = require("../utils/wallet.utils")

async function generateWallet(amount) {
    console.log(`generating ${amount} wallet`)
    await Wallet.create(amount)
    console.log(`done!`)
}

generateWallet(15)