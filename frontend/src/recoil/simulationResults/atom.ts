import { atom, selector } from 'recoil'
import { calculateGain, YTCOutput } from '../../features/ytc/ytcHelpers'
import { predictedRateAtom } from '../predictedRate/atom'
import { trancheSelector } from '../trancheRates/atom'
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom is used to contain the results of a ytc simulation
export const simulationResultsAtom = atom({
    key: 'simulationResults',
    default: [] as YTCOutput[],
})

// This atom is used to set whether or not a ytc simulation is underway
export const isSimulatingAtom = atom({
    key: 'isSimulating',
    default: false,
})

// This selector allows a component to determine whether or not the simulation is complete
// without fetching the entire simulation results state into its context
export const isSimulatedSelector = selector({
    key: 'isSimulated',
    get: ({get}) => {
        const simulationResults = get(simulationResultsAtom);

        return simulationResults.length > 0;
    }
})

export const calculatorGainSelector = selector({
    key: 'calculateGain',
    get: ({get}) => {
        const simulationResults = get(simulationResultsAtom);

        const predictedRate = get(predictedRateAtom);

        if (simulationResults.length >= 1){
            const trancheAddress = simulationResults[0].inputs.trancheAddress;
            const trancheRates = get(trancheSelector(trancheAddress));
            return simulationResults.map((result) => {
                return {
                    ...result,
                    gain: calculateGain(result.receivedTokens.yt.amount, predictedRate, result.tranche.expiration, result.spentTokens.baseTokens.amount, result.gas.baseToken, (trancheRates.accruedValue || 0) )
                }
            })
        } else {
            return simulationResults
        }

    }
})