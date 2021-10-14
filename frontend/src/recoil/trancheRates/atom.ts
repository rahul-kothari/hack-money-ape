import { atomFamily, selectorFamily, atom} from 'recoil';

export interface TrancheRatesInterface {
    variable: number,
    fixed: number,
    daysRemaining: number,
}
// atomFamily
const trancheRatesAtoms = atomFamily<TrancheRatesInterface, string>({
    key: "trancheRates",
    default: {
        variable: 0,
        fixed: 0,
        daysRemaining: 0,
    },
  });
  
const trancheAddressAtom = atom<string[]>({
    key: "trancheAddresses",
    default: []
});

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

