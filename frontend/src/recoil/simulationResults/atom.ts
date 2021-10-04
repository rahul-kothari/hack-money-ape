import { atom } from 'recoil'
import { YTCOutput } from '../../features/calculator/calculatorAPI'

export const simulationResultsAtom = atom({
    key: 'simulationResults',
    default: [] as YTCOutput[],
})