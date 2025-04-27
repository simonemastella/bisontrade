// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract BisonGatewayV1 is AccessControl, ReentrancyGuard {
    mapping(address token => bool allowed) public tokenAllowList;

    event Deposit(
        address indexed token,
        uint256 amount,
        uint256 indexed userId,
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
    event WhitelistToken(address indexed token, bool allow);

    error DepositFailed();
    error DepositZeroAmount();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyAllowed(address token) {
        require(tokenAllowList[token], 'Token not whitelisted');
        _;
    }

    function depositERC20(
        IERC20 token,
        uint256 amount,
        uint256 userId
    ) public onlyAllowed(address(token)) {
        if (amount == 0) revert DepositZeroAmount();
        if (!token.transferFrom(msg.sender, address(this), amount))
            revert DepositFailed();
        emit Deposit(address(token), amount, userId, msg.sender);
    }

    function deposit(uint256 userId) public payable onlyAllowed(address(0)) {
        if (msg.value == 0) revert DepositZeroAmount();
        emit Deposit(address(0), msg.value, userId, msg.sender);
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

    function whitelistToken(
        address token,
        bool allow
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenAllowList[token] = allow;
        emit WhitelistToken(token, allow);
    }
}
