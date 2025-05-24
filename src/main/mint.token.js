const { ethers } = require("ethers");
const { megaETH, tkMintTestTokenContract } = require("../config/config");
const Transaction = require("../services/transaction.services");
const Wallet = require("../utils/wallet.utils")

const tokenArr = [
    tkMintTestTokenContract.cUSD,
    tkMintTestTokenContract.tkETH,
    tkMintTestTokenContract.tkUSDC,
    tkMintTestTokenContract.tkWBTC
]

const stats = {
    success: 0,
    reverted: 0,
    total: 0
}

const delay = (min, max) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`\nwaiting ${ms}ms before creating transaction again.`)
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mint(wallets) {
    let i = 0

    while (i < tokenArr.length) {
        try {
            const wallet = new ethers.Wallet(wallets.privateKey, megaETH.rpc)
            const transaction = new Transaction(wallet, tokenArr[i])
            const mint = await transaction.mint(wallet.address, tokenArr[i])
            i++

            if (mint.status === 1) {
                stats.success++
                stats.total++
            } else {
                stats.reverted++
                stats.total++
            }

            await delay(5000, 10000)
        } catch (error) {
            console.error(error)
        }
    }
}

async function loadWallet() {
    let i = 1
    try {
        const wallet = await Wallet.loadPrivatekey()

        for (const pk of wallet) {
            w = new ethers.Wallet(pk, megaETH.rpc)

            console.clear()
            console.log('[MEGAETH BOT | github.com/lilnoxvertz]\n')
            console.log(`[TOTAL TX      : ${stats.total}]`)
            console.log(`✅ | SUCCESS   : ${stats.success}`)
            console.log(`❌ | REVERTED  : ${stats.reverted}`)

            console.log('\n[WALLET]')
            console.log(`LOADED        : ${wallet.length} wallet`)
            console.log(`current wallet: ${w.address} [${i}]\n`)
            await mint(w)

            i++
        }
    } catch (error) {
        console.error(error)
    }
}

loadWallet()