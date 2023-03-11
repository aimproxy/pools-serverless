import {parseAbi} from "abitype";

// IUniswapV3PoolState
export const uniswapV3ABI = parseAbi([
    /// @notice The currently in range liquidity available to the pool
    /// @dev This value has no relationship to the total liquidity across all ticks
    "function liquidity() external view returns (uint128)",

    /// @notice The amounts of token0 and token1 that are owed to the protocol
    /// @dev Protocol fees will never exceed uint128 max in either token
    "function protocolFees() external view returns (uint128 token0, uint128 token1)",

    /// @notice The first of the two tokens of the pool, sorted by address
    /// @return The token contract address
    "function token0() external view returns (address)",

    /// @notice The second of the two tokens of the pool, sorted by address
    /// @return The token contract address
    "function token1() external view returns (address)",

    /// @notice Returns the information about a position by the position's key
    /// @param key The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper
    /// @return _liquidity The amount of liquidity in the position,
    /// Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke,
    /// Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke,
    /// Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke,
    /// Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke
    "function positions(bytes32 key) external view returns (uint128 _liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)"
])