import {atom} from 'recoil';

export const chainNameAtom = atom({
    key: 'chainName',
    default: 'mainnet'
})