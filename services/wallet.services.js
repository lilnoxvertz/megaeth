const { ethers } = require("ethers")
const fs = require("fs")

class Wallet {
    static async load() {
        try {
            const data = fs.readFileSync("privateKey.txt", "utf-8")
            return data
                .split(/\r?\n/)
                .map((line) => line.trim().toLowerCase())
                .filter((wallet) => wallet.trim())
        } catch (error) {
            console.error("privateKey.txt not found!")
            return []
        }
    }

    static async create(amount) {
        let i = 0
        while (i < amount) {
            i++
            const wallet = ethers.Wallet.createRandom()
            fs.appendFileSync("privateKey.txt", `${wallet.privateKey}\n`, { flag: 'a' })
        }
    }
}

module.exports = Wallet