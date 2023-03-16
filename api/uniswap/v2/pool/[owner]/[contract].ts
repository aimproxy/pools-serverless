import { VercelRequest, VercelResponse } from '@vercel/node'
import { ERC20__factory as ERC20, UniswapV2Pair__factory as UniswapV2Pair } from '../../../../../types'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

/**
 * Users LP total multiplied by the token 0|1 reserve,
 * and divided by the total token supply will give user token 0|1 quantity!
 */
const getOwnerTokenBalance = (ownerBalance: bigint, reserve: bigint, totalSupply: bigint) => {
  const o = BigNumber(ownerBalance.toString())
  const r = BigNumber(reserve.toString())
  const s = BigNumber(totalSupply.toString())
  return o.multipliedBy(r).div(s)
}

export default async (req: VercelRequest, res: VercelResponse) => {

  const chain = req.query.chain as string
  const owner = req.query.owner as string
  const contract = req.query.contract as string

  const provider = new ethers.JsonRpcProvider(RPC_HOST)
  const pair = UniswapV2Pair.connect(contract, provider)

  // These variables as constants from this smart contract IUniswapV2ERC20
  const [poolToken, poolTokenDecimals] = await Promise.all([
    pair.symbol(), // this will always return constant UNI-V2
    pair.decimals(), // this will always return constant 18 decimals
  ])

  const [token0, token1] = await Promise.all([
    pair.token0(), // gets the address of token0
    pair.token1(), // gets the address of token1
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

  const [ownerBalance, reserves, supply] = await Promise.all([
    pair.balanceOf(owner), // gets user balance of lp tokens
    pair.getReserves(), // gets the reserves of the pool
    pair.totalSupply(), //  gets total supply of LP tokens
  ])

  // Get the last x*y=k
  const kLast = await pair.kLast()

  // TODO Saber o preço em USD
  // TODO Saber quanto que o trader tem na LP

  res.status(200).json({
    chain,
    [contract]: {
      poolToken,
      pair: `${symbol0}/${symbol1}`,
      owner: {
        contract: owner,
        [poolToken]: ethers.formatUnits(ownerBalance, poolTokenDecimals),
        [symbol0]: getOwnerTokenBalance(ownerBalance, reserves._reserve0, supply),
        [symbol1]: getOwnerTokenBalance(ownerBalance, reserves._reserve1, supply),
      },
      token0: {
        contract: token0,
        decimals: decimals0.toString(),
        balance: `${ethers.formatUnits(reserves._reserve0, decimals0)} ${symbol0}`,
        price: 'fx?',
      },
      token1: {
        contract: token1,
        decimals: decimals1.toString(),
        balance: `${ethers.formatUnits(reserves._reserve1, decimals1)} ${symbol1}`,
        price: 'fx?',
      },
      kLast: BigNumber(kLast.toString()),
    },
  })
}