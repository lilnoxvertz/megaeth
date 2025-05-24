const { ethers } = require("ethers");
const { megaETH } = require("../config/config");
const abi = require("../../abi.json");
const Transaction = require("../services/transaction.services");
const Wallet = require("../utils/wallet.utils");
require("dotenv").config()

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

async function massSend() {
    const wallet = new ethers.Wallet(process.env.treasury_wallet_key, megaETH.rpc)
    const contract = new ethers.Contract(megaETH.ethAddress, abi, wallet)

    let i = 0
    const pkArr = await Wallet.loadPrivatekey()

    if (pkArr.length === 0) {
        console.log("no private keys found")
        process.exit(1)
    }

    try {
        for (const pk of pkArr) {
            const recipient = new ethers.Wallet(pk)
            console.clear()
            console.log('[MEGAETH BOT | github.com/lilnoxvertz]\n')
            console.log(`[TOTAL TX      : ${stats.total}]`)
            console.log(`✅ | SUCCESS   : ${stats.success}`)
            console.log(`❌ | REVERTED  : ${stats.reverted}`)

            console.log(`\n[MASS SENDING ETH | #${i}]`)
            console.log(`wallet : ${wallet.address}`)
            const balance = await megaETH.rpc.getBalance(wallet.address)
            console.log(`balance: ${ethers.formatEther(balance)}`)
            console.log(`\nto     : ${recipient.address}`)
            console.log(`amount : 0.001`)

            const deposit = await contract.deposit({
                value: ethers.parseEther("0.001")
            })
            await deposit.wait()

            const amount = ethers.parseEther("0.001")
            const tx = await contract.transfer(recipient.address, amount)

            await tx.wait()
            const receipt = await new Transaction(wallet).check(tx.hash)

            if (receipt.status === 1) {
                stats.success++
                stats.total++
            } else {
                stats.reverted++
                stats.total
            }

            console.log(`\nhash: https://www.megaexplorer.xyz/tx/${receipt?.hash}`)
            i++
            await delay(5000, 10000)
        }
    } catch (error) {
        console.error(error)
    }
}

massSend()
