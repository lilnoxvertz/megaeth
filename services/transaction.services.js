const ethers = require("ethers")
const abi = require("../abi.json")
const { megaETH, tkMintTestTokenContract } = require("../config/config")
const Token = require("./token.services")

class Transaction {
    constructor(wallet, contractAddress) {
        this.wallet = wallet
        this.contractAddress = contractAddress ? contractAddress : megaETH.contractAddress
        this.contract = new ethers.Contract(
            this.contractAddress, abi, this.wallet
        )
    }

    async approve(tokenAddress, amount) {
        try {
            const token = new ethers.Contract(tokenAddress, abi, this.wallet)
            const approve = await token.approve(megaETH.contractAddress, amount)
            console.log("[APPROVING TRANSACTION]")
            await approve.wait()

            console.log(`✅ | approved hash : https://www.megaexplorer.xyz/tx/${approve.hash}\n`)
        } catch (error) {
            console.error(error)
        }
    }

    async check(hash) {
        try {
            const receipt = await megaETH.rpc.getTransactionReceipt(hash)

            return {
                hash: receipt?.hash,
                status: receipt?.status
            }
        } catch (error) {
            console.error(error)
        }
    }

    async mint(walletAddress, tokenAddress) {
        const getAmount = (tokenAddress, decimal) => {
            switch (tokenAddress) {
                case tkMintTestTokenContract.tkETH:
                    return ethers.parseUnits("1", decimal)
                case tkMintTestTokenContract.tkWBTC:
                    return ethers.parseUnits("0.02", decimal)
                case tkMintTestTokenContract.tkUSDC:
                    return ethers.parseUnits("2000", decimal)
                case tkMintTestTokenContract.cUSD:
                    return ethers.parseUnits("1000", decimal)
            }
        }

        const token = new Token(this.wallet, tokenAddress)
        const [decimal, symbol] = await Promise.all([
            await token.decimal(),
            await token.symbol()
        ])
        console.log(`\n[MINTING ${symbol} TOKEN]`)
        const amount = getAmount(tokenAddress, decimal)

        try {
            const mint = await this.contract.mint(
                walletAddress,
                amount
            )

            await mint?.wait()

            const receipt = await this.check(mint.hash)

            console.log(`🍃 | mint hash     : https://www.megaexplorer.xyz/tx/${receipt.hash}\n?`)

            return { status: receipt?.status }
        } catch (error) {
            console.error("failed minting token:", error)
        }
    }

    async getAmountOutMin(amountIn, path) {
        try {
            const contract = new ethers.Contract(megaETH.contractAddress, abi, this.wallet)
            const amount = await contract.getAmountsOut(amountIn, path)
            const amountOut = BigInt(amount[amount.length - 1])
            const amountOutMin = (amountOut * 99n) / 100n

            return amountOutMin
        } catch (error) {
            console.error(error)
        }
    }

    async swapExactETHForTokens(toTokenAddress, ethAmount) {
        const path = [megaETH.ethAddress, toTokenAddress]

        const amountIn = ethers.parseUnits(ethAmount.toString(), 18)
        const amountOutMin = await this.getAmountOutMin(amountIn, path)

        const deadline = Math.floor(Date.now() / 1000) + 1200

        try {
            console.log("[PROCESSING TRANSACTION]")
            const tx = await this.contract.swapExactETHForTokens(
                amountOutMin,
                path,
                this.wallet.address,
                deadline,
                { value: amountIn }
            )

            await tx.wait()

            const receipt = await this.check(tx.hash)
            return {
                hash: receipt?.hash,
                status: receipt?.status
            }
        } catch (error) {
            console.error(`🧾 | reason        : ${error}`)
        }
    }

    async swapExactTokensForETH(tokenAddress, tokenAmount) {
        const token = new Token(this.wallet, tokenAddress)

        const path = [tokenAddress, megaETH.ethAddress]
        const decimal = await token.decimal()

        const amountIn = ethers.parseUnits(tokenAmount.toString(), decimal)
        const amountOutMin = await this.getAmountOutMin(amountIn, path)

        const deadline = Math.floor(Date.now() / 1000 + 1200)

        await this.approve(tokenAddress, amountIn)

        try {
            console.log("[PROCESSING TRANSACTION]")
            const tx = await this.contract.swapExactTokensForETH(
                amountIn,
                amountOutMin,
                path,
                this.wallet.address,
                deadline
            )

            await tx?.wait()

            const receipt = await this.check(tx?.hash)
            return {
                hash: receipt?.hash,
                status: receipt?.status
            }
        } catch (error) {
            console.error(`🧾 | reason        : ${error}`)
        }
    }

    async swapExactTokensForTokens(tokenOut, tokenIn, tokenAmount) {
        const token = new Token(this.wallet, tokenOut)

        const path = [tokenOut, tokenIn]
        const decimal = await token.decimal()

        const amountIn = ethers.parseUnits(tokenAmount.toString(), decimal)
        const amountOutMin = await this.getAmountOutMin(amountIn, path)

        const deadline = Math.floor(Date.now() / 1000) + 1200

        await this.approve(tokenOut, amountIn)

        const tx = await this.contract.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            this.wallet.address,
            deadline,
            { gasLimit: 200000 }
        )

        await tx?.wait()

        const receipt = await this.check(tx?.hash)
        return {
            hash: receipt?.hash,
            status: receipt?.status
        }
    }
}

module.exports = Transaction