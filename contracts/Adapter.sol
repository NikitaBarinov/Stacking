// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Adapter{
    //Address of UniswapV2Factory contract
    address public factory;
    
    //Address of UniswapV2Router02 contract
    address public router;

    struct stacke{
        address pair;
        uint256 balanceLP;
        uint256 startStackTime;
    }

    stacke[] public stacked;

    mapping(address => mapping(address => address)) public pairs;
    mapping(address => uint256) balances;
    mapping(address => uint256[]) public stackes;
    //Emitted then tokens swapped
    event TokenSwapped(uint256 amountIn, address indexed sender,uint256 va, uint256 va1, uint256 va3, uint256 va4, uint256 va5);
    
    //Emitted then user stacked
    event TokenStacked(address stacker, uint256 value, address pair, uint256 timeStamp);
    
    //Emitted then liquidity added
    event LiquidityAdded(
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity,
        address indexed sender
    );

    //Emitted then contract create new pair
    event PairCreated(
        address indexed token1, 
        address indexed token2, 
        address indexed pair
        );

    constructor(address _factory, address _router) notZeroAddr(_factory, _router){
        factory = _factory;
        router = _router;
    }

    //Check that address is not zero
    modifier notZeroAddr(address _token1, address _token2){
        require(_token1 != address(0) && _token2 != address(0), "Address is zero");
        _;
    }

    /** @notice Create new pair of two tokens.
        *@dev call createPair method of factory contract.
        *@dev emit PairCreated event.
        *@param token1 Address of first token.
        *@param token2 Address of second token.
    */
    function createPair(address token1, address token2) external notZeroAddr(token1, token2){
        pairs[token1][token2] = IUniswapV2Factory(factory).createPair(token1, token2);
        pairs[token2][token1] = pairs[token1][token2]; 
        emit PairCreated(token1, token2, pairs[token1][token2]);
    }   

    /** @notice Add liquidity to msg.sender address.
        *@dev call addLiquidity method of router contract.
        *@dev emit LiquidityAdded event.
        *@param tokenA Address of first token.
        *@param tokenB Address of second token.
        *@param amountADesired Desired amount of tokenA.
        *@param amountBDesired Desired amount of tokenB.
        *@param amountAMin Minimum amount of tokens.
        *@param amountBMin Minimum amount of tokens.
    */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
        )  external 
        notZeroAddr(tokenA, tokenB){
            //how much token need to approve ?
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        IERC20(tokenA).approve(router, amountADesired);
        IERC20(tokenB).approve(router, amountBDesired);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(router)
            .addLiquidity(
                tokenA, 
                tokenB, 
                amountADesired, 
                amountBDesired, 
                amountAMin, 
                amountBMin, 
                address(this), 
                (block.timestamp + 120)
            );
           

        balances[address(this)] = liquidity;

        IERC20(tokenA).transfer(msg.sender, (amountADesired - amountA));
        IERC20(tokenB).transfer(msg.sender, (amountBDesired - amountB));

        emit LiquidityAdded(amountA, amountB, liquidity, msg.sender);
    }  

    /** @notice Swap tokens from token1 to token2 .
        *@dev call swapExactTokensForTokens of Router contract.
        *@dev emit TokenSwapped event.
        *@param tokenA Address of token from.
        *@param tokenB Address of token to.
        *@param _amountIn Amount of tokens which sender want to swap.
        *@param _amountOutMin Minimum amount of tokens which sender want to receive.
    */
    function swap(
        address tokenA, 
        address tokenB,
        uint256 _amountIn, 
        uint256 _amountOutMin
        ) external
        notZeroAddr(tokenA, tokenB){
        IERC20(tokenA).transferFrom(msg.sender, address(this), _amountIn);
        address[] memory path = new address[](2);
        
        path[0] = tokenA;
        path[1] = tokenB;

        IERC20(tokenA).approve(router, _amountIn);
        //need to see amounts
        uint256 []memory amounts = IUniswapV2Router02(router)
            .swapExactTokensForTokens(
                _amountIn, 
                _amountOutMin, 
                path, 
                msg.sender, 
                (block.timestamp + 120)
            );
        
        emit TokenSwapped(_amountIn, msg.sender, amounts[0],amounts[1],amounts[2],amounts[3],amounts[4]);
    }

    function startStacking(uint256 _value, address _pair) external {
        require(IUniswapV2Pair(_pair).balanceOf(msg.sender) >= _value, "Insufficent funds");

        stacked.push(stacke(_pair, _value, block.timestamp));

        emit TokenStacked(msg.sender, _value, _pair, block.timestamp);
    }

   // function finshStacking(uint256 id )
} 
