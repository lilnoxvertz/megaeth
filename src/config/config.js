const { ethers } = require("ethers")

const megaETH = {
    rpc: new ethers.JsonRpcProvider("https://carrot.megaeth.com/rpc"),
    ethAddress: "0x776401b9BC8aAe31A685731B7147D4445fD9FB19",
    contractAddress: "0xA6b579684E943F7D00d616A48cF99b5147fC57A5"
}

const tkMintTestTokenContract = {
    tkETH: "0x176735870dc6c22b4ebfbf519de2ce758de78d94",
    tkUSDC: "0xfaf334e157175ff676911adcf0964d7f54f2c424",
    tkWBTC: "0xf82ff0799448630eb56ce747db840a2e02cde4d8",
    cUSD: "0xe9b6e75c243b6100ffcb1c66e8f78f96feea727f",
}

const swapMode = [
    'swapExactETHForTokens',
    'swapExactTokensForETH',
    'swapExactTokensForTokens'
]

module.exports = { megaETH, tkMintTestTokenContract, swapMode }