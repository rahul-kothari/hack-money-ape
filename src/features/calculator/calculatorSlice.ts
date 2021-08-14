import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { calculate, calculateMock, CalculatorData, CalculatorResult } from "./calculatorAPI";

export interface CalculatorState {
    results: CalculatorResult[];
    inputs: {},
    status: 'idle' | 'loading' | 'failed';
}

const initialState: CalculatorState = {
    results: [],
    inputs: {},
    status: 'idle'
}

export const executeCalculatorAsync = createAsyncThunk(
    'calculator/calculate',
    async (args: {provider: Web3Provider, signer: Signer, userData: CalculatorData}) => {
        const response = await calculate(args.provider, args.signer, args.userData);

        return {
            result: response,
            inputs: args.userData,
        };
    }
)

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(executeCalculatorAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(executeCalculatorAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.results = action.payload.result;
            state.inputs = action.payload.inputs;
        })
    }
})

export const selectResults = (state: RootState) => state.calculator.results;
export const selectInputs = (state: RootState) => state.calculator.inputs;

export default calculatorSlice.reducer;