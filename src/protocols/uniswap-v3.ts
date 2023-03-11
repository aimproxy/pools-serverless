import {parseAbi} from "abitype";

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
    "function token1() external view returns (address)"
])