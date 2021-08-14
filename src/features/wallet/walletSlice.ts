import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk  } from "../../app/store";
import { connectWallet} from "./walletAPI";

export interface WalletState {
    provider: Web3Provider | undefined;
    signer: Signer | undefined;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WalletState = {
    provider: undefined,
    signer: undefined,
    status: 'idle',
}

export const walletConnectAsync = createAsyncThunk(
    'wallet/connect',
    async () => {
        const response = await connectWallet();

        return response;
    }
)

export const walletSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        disconnectWallet: (state) => {
            state.provider = undefined;
            state.signer = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(walletConnectAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(walletConnectAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.provider = action.payload.provider;
                state.signer = action.payload.signer;
            })
    }
})

export const { disconnectWallet } = walletSlice.actions;

export const selectProvider = (state: RootState) => state.wallet.provider;
export const selectSigner = (state: RootState) => state.wallet.signer;

export default walletSlice.reducer;