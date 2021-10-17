import {atom} from 'recoil';
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom simply contains the name of the chain that the application is connected to

const initial = (() => {
    if(process.env.REACT_APP_NETWORK){
        return process.env.REACT_APP_NETWORK
    } else {
        return "mainnet"
    }
})()

export const chainNameAtom = atom({
    key: 'chainName',
    default: initial
})