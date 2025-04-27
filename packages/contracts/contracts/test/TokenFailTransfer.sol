// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract MyTokenWithFailTransferFrom is ERC20, Ownable {
    constructor(
        address initialOwner
    ) ERC20('MyToken', 'MTK') Ownable(initialOwner) {}

    function mint(
        address[] memory to,
        uint256[] memory amount
    ) public onlyOwner {
        //this is a mock, otherwise I should check EQ length
        for (uint256 i = 0; i < to.length; i++) {
            _mint(to[i], amount[i]);
        }
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        return false;
    }
}
