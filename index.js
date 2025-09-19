/**
 * @file index.js
 * @description This script handles the frontend logic for the Fund Me application, including wallet connection, funding, withdrawing, and balance checking.
 */

import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

// DOM Elements
const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")

// Event Listeners
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

/**
 * @description Connects to the user's MetaMask wallet, retrieves network and address information, and updates the UI.
 */
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      await ethereum.request({ method: "eth_requestAccounts" })

      // Get provider, network, signer, and address
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const formattedAddress = `${address.substring(0, 7)}...${address.substring(address.length - 5)}`

      // Update UI with connection details
      document.getElementById("networkName").value = network.name
      document.getElementById("connectedAddress").value = formattedAddress
      connectButton.innerHTML = "Connected"
    } catch (error) {
      console.error("An error occurred during connection:", error)
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

/**
 * @description Withdraws funds from the contract.
 */
async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      console.log("Processing transaction...")
      const transactionResponse = await contract.withdraw()
      // Wait for the transaction to be mined
      await transactionResponse.wait(1)
      console.log("Done!")
    } catch (error) {
      console.error("An error occurred during withdrawal:", error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

/**
 * @description Funds the contract with the amount specified in the input field.
 */
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      // Call the fund function from the contract
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      // Wait for the transaction to be mined
      await transactionResponse.wait(1)
    } catch (error) {
      console.error("An error occurred during funding:", error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

/**
 * @description Retrieves the contract balance and updates the UI.
 */
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balanceDisplay = document.getElementById("balanceDisplay")
    try {
      const balance = await provider.getBalance(contractAddress)
      const formattedBalance = ethers.formatEther(balance)
      balanceDisplay.innerHTML = `Balance: ${formattedBalance} ETH`
      console.log(formattedBalance)
    } catch (error) {
      console.error("An error occurred while getting the balance:", error)
      balanceDisplay.innerHTML = "Error getting balance"
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}