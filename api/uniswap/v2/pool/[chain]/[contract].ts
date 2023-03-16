import { VercelRequest, VercelResponse } from '@vercel/node'
import { ERC20__factory as ERC20, UniswapV2Pair__factory as UniswapV2Pair } from '../../../../../types'
import { ethers } from 'ethers'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

export default async (req: VercelRequest, res: VercelResponse) => {

  const chain = req.query.chain as string
  const contract = req.query.contract as string

  const provider = new ethers.JsonRpcProvider(RPC_HOST)

  // Liquidity Pool Contract Consts
  // Can be read from IUniswapV2ERC20 contract
  //string public constant name = 'Uniswap V2';
  //string public constant symbol = 'UNI-V2';
  //uint8 public constant decimals = 18;

  const pair = UniswapV2Pair.connect(contract, provider)

  const [token0, token1] = await Promise.all([
    pair.token0(),
    pair.token1(),
  ])

  const token0ERC20 = ERC20.connect(token0, provider)
  const [balance0, symbol0, decimals0] = await Promise.all([
    token0ERC20.balanceOf(contract), // contract is the lp contract addr
    token0ERC20.symbol(),
    token0ERC20.decimals(),
  ])

  const token1ERC20 = ERC20.connect(token1, provider)
  const [balance1, symbol1, decimals1] = await Promise.all([
    token1ERC20.balanceOf(contract),
    token1ERC20.symbol(),
    token1ERC20.decimals(),
  ])

  const reserves = await pair.getReserves()
  const kLast = await pair.kLast()

  res.status(200).json({
    chain,
    [contract]: {
      token: 'have it later',
      pair: `${symbol0}/${symbol1}`,
      token0: {
        token: token0,
        decimals: decimals0.toString(),
        balance: balance0.toString(),
      },
      token1: {
        token: token1,
        decimals: decimals1.toString(),
        balance: balance1.toString(),
      },
      kLast: kLast.toString(),
      //reserves,
    },
  })
}