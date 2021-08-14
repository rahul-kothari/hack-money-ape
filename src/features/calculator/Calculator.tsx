import React, { useEffect } from 'react';
import { CalculatorData } from './calculatorAPI';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Results } from './component/Results';
import { executeCalculatorAsync, selectResults } from './calculatorSlice';
import { selectProvider, selectSigner } from '../wallet/walletSlice';


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
    const signer = useAppSelector(selectSigner);
    const provider = useAppSelector(selectProvider);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('effect signer and provider')
        if (provider && signer){
            console.log('executing calculation')
            dispatch(executeCalculatorAsync({provider, signer, userData}))
        }
    }, [signer, provider])

    return (
        <Results values={values}/>
    )
}

export default Calculator
