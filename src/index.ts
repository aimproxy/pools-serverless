import express from 'express';
import {Address, configureChains, createClient, readContract} from "@wagmi/core";
import {chains} from "./chains";
import {providers} from "./providers";
import {uniswapV3ABI} from "./protocols/uniswap-v3";

const app = express();

app.use(express.json());

const {provider} = configureChains(chains, providers)
createClient({
    provider,
})

app.get(`/`, async (req, res) => {
    const contract = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8"

    const liquidity = await readContract({
        address: contract as Address,
        abi: uniswapV3ABI,
        functionName: 'liquidity',
    })

    return res.status(200).json({
        [contract]: liquidity
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port: ${port}`));