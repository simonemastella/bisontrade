// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract ReentrantReceiver is Ownable {
    uint256 index = 0;
    event Loop(uint256 num, bytes message);

    constructor() Ownable(msg.sender) {}

    receive() external payable {
        index++;
        (bool success, bytes memory returnData) = msg.sender.call(
            abi.encodeWithSelector(
                bytes4(keccak256('withdraw(address,uint256)')),
                address(this),
                msg.value
            )
        );
        if (!success) {
            emit Loop(index, returnData);
        }
    }
}
