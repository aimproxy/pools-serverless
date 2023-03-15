import { VercelRequest, VercelResponse } from '@vercel/node'
import { ethers } from 'ethers'

// ABIs
import { IUniswapV3Pool__factory as IUniswapV3Pool } from '../../../types'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

export default async (req: VercelRequest, res: VercelResponse) => {

  // Connect to mainnet (homestead) with no API key
  const provider = new ethers.JsonRpcProvider(RPC_HOST)

  const contract = req.query.contract as string
  const pool = IUniswapV3Pool.connect(contract, provider)

  const [token0, token1, fee] = await Promise.all([
    pool.token0(),
    pool.token1(),
    pool.fee(), // @ethersproject to have big int right
  ])

  res.status(200).json({
    [contract]: {
      token0, token1, fee: BigInt(fee).toString(),
    },
  })
}