const Wallet = require("./services/wallet.services")

async function generateWallet(amount) {
    console.log(`generating ${amount} wallet`)
    await Wallet.create(amount)
    console.log(`done!`)
}

generateWallet(9)