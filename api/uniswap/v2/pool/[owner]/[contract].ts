import { VercelRequest, VercelResponse } from '@vercel/node'
import { ERC20__factory as ERC20, UniswapV2Pair__factory as UniswapV2Pair } from '../../../../../types'
import { ethers } from 'ethers'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

/**
 * Users LP total multiplied by the token 0|1 reserve,
 * and divided by the total token supply will give user token 0|1 quantity!
 */
const getOwnerTokenBalance = (owner: bigint, reserve: bigint, supply: bigint) => owner * reserve / supply

export default async (req: VercelRequest, res: VercelResponse) => {

  const owner = req.query.owner as string
  const contract = req.query.contract as string

  const provider = new ethers.JsonRpcProvider(RPC_HOST)
  const pair = UniswapV2Pair.connect(contract, provider)

  // TODO These variables as constants from this smart contract IUniswapV2ERC20
  const [
    poolToken, poolTokenDecimals,
    token0, token1,
    ownerBalance, reserves, supply,
  ] = await Promise.all([
    pair.symbol(), // this will always return constant UNI-V2
    pair.decimals(), // this will always return constant 18 decimals
    pair.token0(), // gets the address of token0
    pair.token1(), // gets the address of token1
    pair.balanceOf(owner), // gets user balance of lp tokens
    pair.getReserves(), // gets the reserves of the pool
    pair.totalSupply(), //  gets total supply of LP tokens
  ])

  const token0ERC20 = ERC20.connect(token0, provider)
  const [symbol0, decimals0] = await Promise.all([
    token0ERC20.symbol(), // gets the symbol from token0
    token0ERC20.decimals(), // gets the decimals from token0
  ])

  const token1ERC20 = ERC20.connect(token1, provider)
  const [symbol1, decimals1] = await Promise.all([
    token1ERC20.symbol(), // gets the symbol from token1
    token1ERC20.decimals(), // gets the decimals from token1
  ])

  const ownerBalances = {
    token0: getOwnerTokenBalance(ownerBalance, reserves._reserve0, supply),
    token1: getOwnerTokenBalance(ownerBalance, reserves._reserve1, supply),
  }

  res.status(200).json({
    [contract]: {
      poolToken,
      pair: `${symbol0}/${symbol1}`,
      owner: {
        contract: owner,
        [poolToken]: ethers.formatUnits(ownerBalance, poolTokenDecimals),
        [symbol0]: ethers.formatUnits(ownerBalances.token0, decimals0),
        [symbol1]: ethers.formatUnits(ownerBalances.token1, decimals1),
      },
      pool: {
        [symbol0]: ethers.formatUnits(reserves._reserve0, decimals0),
        [symbol1]: ethers.formatUnits(reserves._reserve1, decimals1),
      },
      token0: {
        contract: token0,
        symbol: symbol0,
        decimals: decimals0.toString(),
      },
      token1: {
        contract: token1,
        symbol: symbol1,
        decimals: decimals1.toString(),
      },
    },
  })
}