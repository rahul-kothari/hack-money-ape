import { atomFamily, selectorFamily, atom} from 'recoil';

// This is a set of recoil atoms
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom family is used to store the variable interest rate, fixed interest rate and number of days remaining for a given tranche
// The key for this family is the tranche address

export interface TrancheRatesInterface {
    variable: number,
    fixed: number,
    daysRemaining: number,
}

// This is an atom family, it functions as a key value pair of atoms allowing for the generation of new atoms if an existing one is not found
// This key is the tranche address
const trancheRatesAtoms = atomFamily<TrancheRatesInterface, string>({
    key: "trancheRates",
    default: {
        variable: 0,
        fixed: 0,
        daysRemaining: 0,
    },
  });
  
// The atoms in an atomFamily can only be retrieved with the key similar to a Solidity mapping type
// Thus we have a second atom that stores an array of all of the keys
const trancheAddressAtom = atom<string[]>({
    key: "trancheAddresses",
    default: []
});

// This is a selector, it allows for the redefinition of the get and set functions for an atom, or atom family
// This selector redefines the set method to also add the key to the array atom when a new atom is added
export const trancheSelector = selectorFamily<TrancheRatesInterface, string>({
    key: "tranches-access",
    get:  (id: string) => ({ get }) => {
        const atom = get(trancheRatesAtoms(id));
        return atom;
    },
    set: (id: string) => ({set}, newTranche) => {
        set(
            trancheRatesAtoms(id),
            newTranche
        );
        set(trancheAddressAtom, prev => [...prev, id]);
    }
});

