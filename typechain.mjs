import { glob, runTypeChain } from 'typechain'
import path from 'path'
import fs from 'fs'
import fsp from 'fs/promises'

async function main() {
  const cwd = process.cwd()

  if (!fs.existsSync('./cache/json-abis')) {
    await fsp.mkdir('./cache/json-abis', { recursive: true })
  }

  if (fs.existsSync('./types')) {
    await fsp.rm('./types', { recursive: true, force: true })
  }
  await fsp.mkdir('./types')

  const contracts = path.resolve(cwd, './abis')
  if (!fs.existsSync(contracts)) {
    throw new Error('Local ABIs not found')
  }

  const uniswapV3Core = path.resolve(cwd, './node_modules/@uniswap/v3-core')
  if (!fs.existsSync(uniswapV3Core)) {
    throw new Error('@uniswap/v3-core not found')
  }

  const uniswapV3Periphery = path.resolve(cwd, './node_modules/@uniswap/v3-periphery')
  if (!fs.existsSync(uniswapV3Periphery)) {
    throw new Error('@uniswap/v3-periphery not found')
  }

  const importABIs = glob(cwd, [
    `${contracts}/**/*.json`,
    `${uniswapV3Core}/artifacts/contracts/**/*.json`,
    `${uniswapV3Periphery}/artifacts/contracts/NonfungiblePositionManager.sol/*.json`,
  ])

  const copiedABIs = []

  for (const file of importABIs) {
    const dest = `${cwd}/cache/json-abis/${file.split('/').pop()}`

    const content = await fsp.readFile(file, 'utf8')
    const obj = JSON.parse(content)
    obj.bytecode = '0x'
    obj.deployedBytecode = '0x'
    await fsp.writeFile(dest, JSON.stringify(obj))

    copiedABIs.push(dest)
  }


  await runTypeChain({
    cwd,
    filesToProcess: copiedABIs,
    allFiles: copiedABIs,
    outDir: './types',
    target: 'ethers-v6',
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    if (fs.existsSync('./cache/json-abis'))
      await fsp.rm('./cache/json-abis', { recursive: true, force: true })
  })