import {atom} from 'recoil';

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