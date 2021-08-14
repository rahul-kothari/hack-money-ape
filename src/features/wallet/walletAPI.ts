import { Web3Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";

export const connectWallet = async (): Promise<{provider: Web3Provider, signer: Signer}> => {
    
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    return {
        provider,
        signer,
    }
}