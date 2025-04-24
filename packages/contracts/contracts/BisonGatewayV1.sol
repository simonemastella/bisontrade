// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract BisonGatewayV1 is AccessControl, ReentrancyGuard {
    event Deposit(
        address indexed token,
        uint256 amount,
        bytes16 indexed uuid,
        address indexed sender
    );
    event WithdrawSucceeded(
        address indexed token,
        uint256 amount,
        address indexed beneficiary
    );
    event WithdrawFailed(
        address indexed token,
        uint256 amount,
        address indexed beneficiary,
        bytes error
    );
    error DepositFailed();
    error DepositZeroAmount();

    constructor() {}

    function depositERC20(IERC20 token, uint256 amount, bytes16 uuid) public {
        if (amount == 0) revert DepositZeroAmount();
        if (!token.transferFrom(msg.sender, address(this), amount))
            revert DepositFailed();
        emit Deposit(address(token), amount, uuid, msg.sender);
    }

    function deposit(bytes16 uuid) public payable {
        if (msg.value == 0) revert DepositZeroAmount();
        emit Deposit(address(0), msg.value, uuid, msg.sender);
    }

    function withdraw(
        address to,
        uint256 amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        (bool success, bytes memory reason) = payable(to).call{value: amount}(
            ''
        );
        if (success) emit WithdrawSucceeded(address(0), amount, to);
        else emit WithdrawFailed(address(0), amount, to, reason);
    }

    function withdrawERC20(
        IERC20 token,
        address to,
        uint256 amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        bool success = token.transferFrom(msg.sender, address(this), amount);
        if (success) emit WithdrawSucceeded(address(0), amount, to);
        else emit WithdrawFailed(address(0), amount, to, '');
    }
}
