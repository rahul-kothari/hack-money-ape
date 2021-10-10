import { atom, selector } from 'recoil'
import { YTCOutput } from '../../features/ytc/ytcHelpers'

export const simulationResultsAtom = atom({
    key: 'simulationResults',
    default: [] as YTCOutput[],
})

export const isSimulatingAtom = atom({
    key: 'isSimulating',
    default: false,
})

export const isSimulatedSelector = selector({
    key: 'isSimulated',
    get: ({get}) => {
        const simulationResults = get(simulationResultsAtom);

        return simulationResults.length > 0;
    }
})