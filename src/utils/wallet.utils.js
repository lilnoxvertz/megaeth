const { ethers } = require("ethers")
const fs = require("fs")

class Wallet {
    static async loadPrivatekey() {
        try {
            return fs.readFileSync("privateKey.txt", "utf8")
                .split("\n")
                .filter((line) => line.trim())
                .map((address) => address.trim().split(",")[0])
        } catch (error) {
            console.error(error)
        }
    }

    static async loadWalletAddress() {
        try {
            return fs.readFileSync("privateKey.txt", "utf8")
                .split("\n")
                .filter((line) => line.trim())
                .map((address) => address.trim().split(",")[1])
        } catch (error) {
            console.error(error)
        }
    }

    static async create(amount) {
        let i = 0
        while (i < amount) {
            i++
            const wallet = ethers.Wallet.createRandom()
            fs.appendFileSync("privateKey.txt", `${wallet.privateKey},${wallet.address}\n`, { flag: 'a' })
        }
    }
}

module.exports = Wallet