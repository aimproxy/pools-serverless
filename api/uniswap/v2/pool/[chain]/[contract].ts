import { VercelRequest, VercelResponse } from '@vercel/node'
import { UniswapV2Pair__factory as IUniswapV2Pair } from '../../../../../types'
import { ethers } from 'ethers'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

export default async (req: VercelRequest, res: VercelResponse) => {

  const chain = req.query.chain as string
  const contract = req.query.contract as string

  const provider = new ethers.JsonRpcProvider(RPC_HOST)

  const pair = IUniswapV2Pair.connect(contract, provider)

  const name = await pair.name()

  const [symbol, decimals] = await Promise.all([
    pair.symbol(),
    pair.decimals(),
  ])

  const [token0, token1] = await Promise.all([
    pair.token0(),
    pair.token1(),
  ])

  const reserves = await pair.getReserves()
  const kLast = await pair.kLast()

  res.status(200).json({
    chain,
    [contract]: {
      pool: name,
      lp_token: {
        symbol,
        decimals: decimals.toString(),
      },
      pair: {
        token0,
        token1,
      },
      kLast: kLast.toString(),
      //reserves,
    },
  })
}