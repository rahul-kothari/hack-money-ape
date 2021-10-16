import {atom} from 'recoil'
import constants from '../../constants/mainnet-constants.json';

// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom is used to store the values of the element deployment addresses

export const elementAddressesAtom = atom({
  key: 'elementAddresses',
  default: constants,
})