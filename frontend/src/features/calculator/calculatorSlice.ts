import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { RootState } from "../../app/store";
import { calculate, CalculatorData, YTCOutput } from "./calculatorAPI";

export interface CalculatorState {
    results: YTCOutput[];
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
    async (args: {userData: CalculatorData, signer: ethers.Signer}) => {
        const response = await calculate(args.userData, args.signer);

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