const { ethers } = require("ethers")

class Randomize {
    static tokenAddress(array) {
        const randomIndex = Math.floor(Math.random() * array.length)
        return array[randomIndex]
    }

    static tokenAmount(tokenAmount, decimal) {
        try {
            const minPercent = 1n
            const maxPercent = 1n

            const minAmount = (tokenAmount * minPercent) / 100n
            const maxAmount = (tokenAmount * maxPercent) / 100n

            const range = maxAmount - minAmount
            const randomOffset = BigInt(Math.floor(Number(range) * Math.random()))
            const amountIn = minAmount + randomOffset

            const randomAmount = parseFloat(ethers.formatUnits(amountIn, Number(decimal)))

            return randomAmount
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Randomize