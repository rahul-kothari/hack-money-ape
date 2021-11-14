import {atom} from 'recoil';
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom keeps track of the predicted variable return for a tranche
export const predictedRateAtom = atom<number | undefined>({
    key: 'predictedRate',
    default: 1
})