// const ethers = require("ethers")
// const fs = require("fs-extra")
// require("dotenv").config()

import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
    console.log("HI")
    let variable = 5

    console.log(variable)

    // http://0.0.0.0:8545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    //const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    // let wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    // wallet = await wallet.connect(provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract =
        await contractFactory.deploy(/*{ gasPrice: 1000000000000 }*/)
    await contract.deployTransaction.wait(1)

    console.log(`Contract Address: ${contract.address}`)

    // get numbers
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated Favorite Number: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
