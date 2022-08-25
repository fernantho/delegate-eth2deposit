// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.13;

interface IDepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
}

contract CallDeposit {
    event LogDepositData(
        address _contractAddress,
        uint256 _amount,
        bytes _pubkey,
        bytes _withdrawal_credentials,
        bytes _signature,
        bytes32 _deposit_data_root
    );

    receive() external payable {}

    function callDepositFunction(
        address _contractAddress,
        uint256 _amount,
        bytes calldata _pubkey,
        bytes calldata _withdrawal_credentials,
        bytes calldata _signature,
        bytes32 _deposit_data_root
    ) external {
        IDepositContract(_contractAddress).deposit{value: _amount}(
            _pubkey,
            _withdrawal_credentials,
            _signature,
            _deposit_data_root
        );

        emit LogDepositData(
            _contractAddress,
            _amount,
            _pubkey,
            _withdrawal_credentials,
            _signature,
            _deposit_data_root
        );
    }
}
