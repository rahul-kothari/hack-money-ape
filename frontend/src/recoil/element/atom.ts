import {atom} from 'recoil'
import constants from '../../constants/mainnet-constants.json';

export const elementAddressesAtom = atom({
  key: 'elementAddresses',
  default: constants,
})