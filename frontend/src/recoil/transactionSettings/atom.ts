import {atom} from 'recoil';
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom keeps track of the slippage tolerance set by the user
export const slippageToleranceAtom = atom({
    key: 'slippageTolerance',
    default: 1
})