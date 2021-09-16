import React, { useEffect } from 'react';
import { CalculatorData } from './calculatorAPI';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Results } from './component/Results';
import { executeCalculatorAsync, selectResults } from './calculatorSlice';
import {useWallet} from 'use-wallet';


//TODO replace hardcoded user data with form input
const userData: CalculatorData = {
            baseTokenName: 'dai',
            trancheIndex: 0,
            amountCollateralDeposited: 100,
            speculatedVariableRate: 10
        }

interface Props {
}

export const Calculator = (props: Props) => {
    const values = useAppSelector(selectResults);
    const dispatch = useAppDispatch();

    // const wallet = useWallet();

    // useEffect(() => {
    //     console.log('effect signer and provider')
    //     if (wallet.status === 'connected'){
    //         console.log('executing calculation')
    //         dispatch(executeCalculatorAsync({wallet, userData}))
    //     }
    // }, [wallet])

    return (
        <Results values={values}/>
    )
}

export default Calculator
