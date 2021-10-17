import { atom, selector } from 'recoil'
import { YTCOutput } from '../../features/ytc/ytcHelpers'
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