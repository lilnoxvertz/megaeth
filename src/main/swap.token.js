const { ethers } = require("ethers")
const { megaETH, tkMintTestTokenContract, swapMode } = require("../config/config")
const Token = require("../services/token.services")
const Wallet = require("../utils/wallet.utils")
const Randomize = require("../utils/randomize")
const Transaction = require("../services/transaction.services")

const stats = {
    success: 0,
    reverted: 0,
    total: 0,
    cycle: 1
}

const tokenArr = [
    tkMintTestTokenContract.cUSD,
    tkMintTestTokenContract.tkETH,
    tkMintTestTokenContract.tkUSDC,
    tkMintTestTokenContract.tkWBTC
]

const delay = (min, max) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`\nwaiting ${ms}ms before creating transaction again.`)
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isRunning = true

async function updateStatus(status) {
    if (status === 1) {
        stats.success++
        stats.total++
    } else {
        stats.reverted++
        stats.total++
    }
}

async function swapETHtoToken(wallet, tokenToSwap) {
    const transaction = new Transaction(wallet)
    console.log("[SWAPPING FROM ETH TO TOKEN]")

    try {
        const toTokenAddress = tokenToSwap

        const token = new Token(wallet, toTokenAddress)
        const toTokenSymbol = await token.symbol()

        const ethBalance = await megaETH.rpc.getBalance(wallet.address)
        const tokenAmount = Randomize.tokenAmount(ethBalance, 18)

        console.log(`🔁 | SWAPPING  : ${tokenAmount} ETH to ${toTokenSymbol}\n`)
        const tx = await transaction.swapExactETHForTokens(toTokenAddress, tokenAmount)
        console.log(`🧾 | tx hash       : https://www.megaexplorer.xyz/tx/${tx?.hash}`)
        await updateStatus(tx?.status)
    } catch (error) {
        console.error(error)
    }
}

async function swapTokenToETH(wallet, tokenToSwap) {
    const transaction = new Transaction(wallet)
    console.log("[SWAPPING FROM TOKEN TO ETH]")

    try {
        const fromTokenAddress = tokenToSwap
        const token = new Token(wallet, fromTokenAddress)

        const [fromTokenBalance, fromTokenDecimal, fromTokenSymbol] = await Promise.all([
            token.balance(),
            token.decimal(),
            token.symbol()
        ])

        const tokenAmount = Randomize.tokenAmount(fromTokenBalance, fromTokenDecimal)

        console.log(`🔁 | SWAPPING  : ${tokenAmount} ${fromTokenSymbol} to ETH\n`)
        const tx = await transaction.swapExactTokensForETH(fromTokenAddress, tokenAmount)
        console.log(`🧾 | tx hash       : https://www.megaexplorer.xyz/tx/${tx?.hash}`)
        await updateStatus(tx?.status)
    } catch (error) {
        console.error(error)
    }
}

async function swapTokenToToken(wallet) {
    const transaction = new Transaction(wallet)
    console.log("[SWAPPING FROM TOKEN TO TOKEN]")

    try {
        const [fromTokenAddress, toTokenAddress] = await Promise.all([
            Randomize.tokenAddress(tokenArr),
            Randomize.tokenAddress(tokenArr)
        ])

        const token = new Token(wallet, fromTokenAddress)

        const [fromTokenBalance, fromTokenDecimal, fromTokenSymbol] = await Promise.all([
            token.balance(),
            token.decimal(),
            token.symbol(),
        ])

        const newToToken = fromTokenAddress === toTokenAddress ? tokenArr[0] : toTokenAddress

        const newTokenSymbol = await new Token(wallet, newToToken).symbol()
        const tokenAmount = Randomize.tokenAmount(fromTokenBalance, fromTokenDecimal)

        console.log(`🔁 | SWAPPING  : ${tokenAmount} ${fromTokenSymbol} to ${newTokenSymbol}\n`)
        const tx = await transaction.swapExactTokensForTokens(fromTokenAddress, newToToken, tokenAmount)
        console.log(`🧾 | tx hash       : https://www.megaexplorer.xyz/tx/${tx?.hash}`)

        updateStatus(tx?.status)
    } catch (error) {
        console.error('failed processing transaction', error)
    }
}

async function startingTransaction(wallet) {
    console.log(`[CREATING TRANSACTION]\n`)
    const mode = Math.floor(Math.random() * swapMode.length)

    const tokenToSwap = await Randomize.tokenAddress(tokenArr)

    try {
        switch (mode) {
            case 0:
                await swapETHtoToken(wallet, tokenToSwap)
                await delay(5000, 10000)
                break

            case 1:
                await swapTokenToETH(wallet, tokenToSwap)
                await delay(5000, 10000)
                break

            case 2:
                await swapTokenToToken(wallet)
                await delay(5000, 10000)
                break
        }
    } catch (error) {
        console.error(error)
    }
}

async function processWallet(wallets) {
    let i = 1
    while (isRunning) {
        try {
            for (const privateKey of wallets) {

                const wallet = new ethers.Wallet(privateKey, megaETH.rpc)

                if (i === wallets.length) {
                    i = 1
                    stats.cycle++
                }

                console.clear()
                console.log('[MEGAETH BOT | github.com/lilnoxvertz]\n')
                console.log(`[TOTAL TX      : ${stats.total}]`)
                console.log(`✅ | SUCCESS   : ${stats.success}`)
                console.log(`❌ | REVERTED  : ${stats.reverted}`)

                console.log('\n[WALLET]')
                console.log(`LOADED         : ${wallets.length} wallet`)
                console.log(`CYCLE          : ${stats.cycle}`)
                console.log(`current wallet : ${wallet.address} [${i}]\n`)

                await startingTransaction(wallet)
                i++
            }

            stats.cycle++
        } catch (error) {
            console.error(error)
        }
    }
}

async function main() {
    try {
        const wallets = await Wallet.loadPrivatekey()

        if (wallets.length === 0) {
            console.log('no private key found at privateKey.txt')
            process.exit(1)
        }

        await processWallet(wallets)
    } catch (error) {
        console.error(error)
    }
}

main()