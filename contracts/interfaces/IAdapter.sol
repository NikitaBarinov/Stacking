// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IAdapter {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function createPair(address , address ) external;

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
        )  external;

    function swap(
        address tokenA, 
        address tokenB,
        uint256 _amountIn, 
        uint256 _amountOutMin
        ) external;
}