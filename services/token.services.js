const { megaETH } = require("../config/config")
const abi = require("../abi.json")
const { ethers } = require("ethers")

class Token {
    constructor(wallet, tokenAddress) {
        this.contractAddress = tokenAddress
        this.wallet = wallet
        this.contract = new ethers.Contract(
            this.contractAddress, abi, wallet
        )
    }

    async name() {
        return await this.contract.name()
    }

    async balance() {
        try {
            const [name, decimal, balance] = await Promise.all([
                await this.name(),
                await this.decimal(),
                await this.contract.balanceOf(this.wallet.address)
            ])

            const parsedBalance = parseFloat(ethers.formatUnits(balance, Number(decimal)))
            console.log(`💲 | BALANCE   : ${parsedBalance} ${name}`)

            return balance
        } catch (error) {
            console.error(error)
        }
    }

    async symbol() {
        return await this.contract.symbol()
    }

    async decimal() {
        return await this.contract.decimals()
    }
}

module.exports = Token