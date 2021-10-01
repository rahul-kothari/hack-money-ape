import React from 'react'
import { Formik, FormikValues, FormikHelpers, Form } from "formik";
import {
    NumberInputControl,
    SelectControl,
    SubmitButton,
} from 'formik-chakra-ui';
import * as Yup from 'yup';
import { Tranche } from '../../../types/manual/types';

// TODO do we need decimals?
interface Props {
    tranches: Tranche[];
    // TODO find types for formikbag
    onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<any>) => Promise<void>;
}

const validationSchema = Yup.object({
    trancheAddress: Yup.string().required(),
    amountCollateralDeposited: Yup.number().required().min(0),
    speculatedVariableRate: Yup.number().required().min(0),
})

const initialValues = {
    trancheAddress: '0x0',
    amountCollateralDeposited: 0,
    speculatedVariableRate: 0,
}


const CalculatorForm = (props: Props) => {

    const {tranches, onSubmit} = props;
    
    // TODO find types for formikhelpers
    const handleSubmit = async (values: FormikValues, formikHelpers: FormikHelpers<any>) => {
        await onSubmit(values, formikHelpers)
        return;
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form>
                <SelectControl name="tranchAddress" label="Tranche">
                    {
                        tranches.sort((a, b) => (a.expiration - b.expiration)).map((tranche: Tranche) => (
                            <option
                                value={tranche.address}
                                key={tranche.address}
                            >
                                {(new Date(tranche.expiration * 1000)).toString()}
                            </option>
                        ))
                    }
                </SelectControl>
                <NumberInputControl
                    name="amountCollateralDeposited"
                    label="Number of tokens"
                    numberInputProps={{ min: 0 }}
                    showStepper={false}
                />
                <NumberInputControl
                    name="speculatedVariableRate"
                    label="Speculated Variable Rate"
                    numberInputProps={{ min: 0 }}
                    showStepper={false}
                />
                <SubmitButton
                    mt={4}
                    colorScheme="teal"
                >
                    Calculate
                </SubmitButton>
            </Form>
        </Formik>
    )
}

export default CalculatorForm
