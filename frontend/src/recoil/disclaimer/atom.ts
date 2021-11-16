import {atom} from 'recoil'

// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom is used to store whether or not the disclaimer has been closed

export const disclaimerAtom = atom({
  key: 'disclaimer',
  default: true,
})