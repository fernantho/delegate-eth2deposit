## ETH2 Deposit Smart Contract workaround

This is just contract that receives ETH and sends to the deposit contract with the proper deposit data.

## How to use it
1. Get some Goerli from any faucet
2. Create a config file in this repo root path as follows:
```bash
GOERLI_URL=#"https://goerli.infura.io/v3/$PROJECT_ID"
PRIVATE_KEY=#'Private key of the account holding goETH'
PROXY_ETH2_CONTRACT=#'Testnet address of the CallDeposit contract deployed'
ETH2_DEPOSIT_CONTRACT='0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b' # ETH2 Deposit contract address 

VALIDATOR_PUBLIC_KEY=#'BLS Public Key of the validator <- generated with ethdo tool'
WITHDRAWAL_CREDENTIALS=#'Withdrawal credentials <- generated with ethdo tool'
AMOUNT=#'amount to be sent <- generated with ethdo tool'
SIGNATURE=#'BLS signature  <- generated with ethdo tool'
DEPOSIT_DATA_ROOT=#'deposit data root  <- generated with ethdo tool'
```
3. Fulfil params in file ```./.env```. You need an RPC to connect to Goerli and the private key of the wallet holding the ETH to be sent to the smart contract. It is also needed to get the deposit data parameters from ethdo tool. You can just use its docker image
   - Create a wallet:
  ```bash
  docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo wallet create --wallet=wallet --base-dir=/data --type="hd" --wallet-passphrase="XXXXXXXX"
  ```
   - Create a validator associated from the HD wallet:
  ```bash
  docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo account create --account=wallet/account --base-dir=/data --wallet-passphrase="XXXXXXXX" --passphrase="XXXXXXXX"
  ```
   - Create deposit data (forkversion param is for Goerli Testnet):
  ```bash 
  docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo --base-dir=/data validator depositdata --withdrawaladdress=0x000000000000000 --depositvalue="1 Ether" --validatoraccount=wallet/account --passphrase="XXXXXXXX" --forkversion=0x00001020
  ```
  The output of this command is a JSON that contains the data needed in ```./.env```
  ```json
    [
        {
            "name":"Deposit for wallet1/account",
            "account":"wallet1/account",
            "pubkey":"0x81f9091ef7f988fe3f51aaffb0aef2ff9d452f7d1caf3dbcf29ffdcae93ecbfd4608377b2cf44260a172466a0b795b82","withdrawal_credentials":"0x0100000000000000000000002b2f78c5bf6d9c12ee1225d5f374aa91204580c3","signature":"0xac049f7368a6ab8091360568faf3c0ad6a42857ce25f785aeb9d738d0c04fe0a020a6f538e8a50da0dd3b9c94c1b120d13dd904df90142b7643d44ee0b3bc48a5d81a203e96aadd74caf4b6793607abb54e24b4ac81f7c76fd5d1f7e6985c503",
            "amount":2000000000,
            "deposit_data_root":"0xca44a44b8f230482d1954e47b93cd6b15934cc4b043c06b4a8d449cfe9d5a50a",
            "deposit_message_root":"0x02956f7f7c519a9f2e680cd206132862b40fe870185433ff4c663835f250b051",
            "fork_version":"0x00001020",
            "version":3
        }
    ]
``` 

3. Deploy CallDeposit contract. This command returns the address of the deployed smart contract. This info also goes to a parameter in ```./.env``` PROXY_ETH2_CONTRACT
```bash
npx hardhat run scripts/deploy.js --network goerli
```

4. Send some ETH to the smart contract: this ETH will be sent to the validators through Deposit Contract  
5. Run the callDeposit.js script. This script take all the parameters needed from de ```./.env``` file
```bash 
   npx hardhat run scripts/callDeposit.js --network goerli
```
