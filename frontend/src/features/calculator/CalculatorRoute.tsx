import React from 'react'
import { useParams } from 'react-router-dom';
import CalculatorForm from './component/CalculatorForm';
import { getTokenNameByAddress } from './calculatorAPI';
import { elementAddressesAtom } from '../../recoil/element/atom';
import { useRecoilValue } from 'recoil';
import { ConstantsObject } from '../../types/manual/types';

interface Props {}


const CalculatorRoute: React.FC<Props> = (props) => {
    const params: {token: string} = useParams();

    const elementAddresses: ConstantsObject = useRecoilValue(elementAddressesAtom)

    const tokenName = getTokenNameByAddress(params.token, elementAddresses.tokens)


    return (
        tokenName ?
        <CalculatorForm 
            tranches={
                elementAddresses.tranches[tokenName]
            }
            onSubmit = {async (values, formikHelpers) => {
                alert(JSON.stringify(values));
                return
            }}
        /> :
        <div> Invalid Token </div>
    )
}

export default CalculatorRoute

