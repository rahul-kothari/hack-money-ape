import React, { useEffect } from 'react';
import { CalculatorData } from './calculatorAPI';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Results } from './component/Results';
import { executeCalculatorAsync, selectResults } from './calculatorSlice';


//TODO replace hardcoded user data with form input
const userData: CalculatorData = {
            baseTokenName: 'dai',
            trancheIndex: 0,
            amountCollateralDeposited: 100000000,
            speculatedVariableRate: 10
        }

interface Props {
}

export const Calculator = (props: Props) => {
    const values = useAppSelector(selectResults);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(executeCalculatorAsync(userData))
    })

    return (
        <Results values={values}/>
    )
}

export default Calculator
