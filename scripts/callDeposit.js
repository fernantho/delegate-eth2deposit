const { ethers } = require("hardhat");

require("dotenv").config();

// Connect to the network
let provider = ethers.getDefaultProvider('goerli');

// Load the wallet to deploy the contract with
let privateKey = process.env.PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey, provider);

async function main() {
    const [deployer] = await ethers.getSigners();

    // Args needed
    const callDepositAddress = process.env.PROXY_ETH2_CONTRACT;
    const depositAddress = process.env.ETH2_DEPOSIT_CONTRACT;

    const pubkey = process.env.VALIDATOR_PUBLIC_KEY;
    const withdrawal_credentials = process.env.WITHDRAWAL_CREDENTIALS;
    const amount = process.env.AMOUNT;
    const signature = process.env.SIGNATURE;
    const deposit_data_root = process.env.DEPOSIT_DATA_ROOT;

    let abi = [
        "function callDepositFunction(address _contractAddress,uint256 _amount,bytes calldata _pubkey,bytes calldata _withdrawal_credentials,bytes calldata _signature,bytes32 _deposit_data_root) external"
    ];

    // Log ENV variables
    console.log("********************************************************");
    console.log("");
    console.log("Call deposit contract", callDepositAddress);
    console.log("Eth2 deposit contract", depositAddress);
    console.log("Pubkey", pubkey);
    console.log("Withdrawal credentials", withdrawal_credentials);
    console.log("Amount", amount);
    console.log("Signature", signature);
    console.log("Deposit data root", deposit_data_root);
    console.log("");
    console.log("********************************************************");

    // Log ABI
    console.log("callDeposit contract - ABI: ", abi);

    // Load Proxy to deposit contract address
    const callDepositContract = new ethers.Contract(callDepositAddress, abi, provider);

    // Connect to signer (the TX sender)
    let contractWithSigner = callDepositContract.connect(wallet);

    // Send transaction to proxy contract
    let tx = await contractWithSigner.callDepositFunction(depositAddress, ethers.utils.parseEther(String(amount / 1000000000)), pubkey, withdrawal_credentials, signature, deposit_data_root, { gasLimit: 330000 });
    console.log("TX to CallDeposit Contract hash : ", tx.hash);

    await tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



