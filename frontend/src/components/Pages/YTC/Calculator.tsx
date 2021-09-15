import { Button, Select } from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Token, Tranche } from "../../../types/manual/types";
import { Approval } from '../../../features/approval/Approval';
import { getBalance, getTranches } from "../../../features/element";

interface CalculateProps {
    tokens: Token[];
    onSimulate: () => void;
    simulated: boolean;
}

export interface FormFields {
    tokenAddress: string | undefined,
    trancheAddress: string | undefined,
    amount: number | undefined,
    compounds: number | undefined
}



export const Calculator: React.FC<CalculateProps> = (props: CalculateProps) => {
    const {tokens, onSimulate, simulated} = props;

    const initialValues: FormFields = {
        tokenAddress: undefined,
        trancheAddress: undefined,
        amount: undefined,
        compounds: undefined
    }

    return (
        <div id="calculate" className="py-5 flex flex-col gap-3">
            <Formik
                initialValues={initialValues}
                onSubmit={onSimulate}
            >
                <Form
                    tokens={tokens}
                    simulated={simulated}
                />
            </Formik>
        </div>
    )

}

// TOOD this can be moved to a utility
function useQuery() {
    return new URLSearchParams(useLocation().search);
}


interface FormProps {
    tokens: Token[];
    simulated: boolean;
}

const Form: React.FC<FormProps> = (props) => {

    const {tokens, simulated} = props;

    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const history = useHistory();
    const query = useQuery();
    const formik = useFormikContext<FormFields>();

    const tokenAddress = formik.values.tokenAddress;
    const setFieldValue = formik.setFieldValue;

    const getTokenAddress = useCallback(
        () => {
            const token = query.get('base_token') || tokens[0].address;
            return token;
        },
        // TODO this should be resolved not ignored
        // eslint-disable-next-line
        [tokens],
    )

    const getTokenNameByAddress = (tokenAddress: string | undefined): string | undefined => {
        if (!tokenAddress){
            return undefined;
        }
        const token: Token | undefined = tokens.find((token) => {
            return token.address === tokenAddress;
        })
        return token?.name || undefined;
    }

    // if there is a token specified in the query params we want to set the value of the form to it
    useEffect(() => {
        console.log('run useeffect')
        if (tokens.length >= 1){
            const tokenAddress = getTokenAddress();
            setFieldValue('tokenAddress', tokenAddress)
        }
    }, [getTokenAddress, tokens, setFieldValue])

    useEffect(() => {
        // if the token is selected then put it in
        if (tokenAddress){
            getTranches(tokenAddress).then((res) => {
                setTranches(res);
            })
            getBalance(tokenAddress).then((res) => {
                setBalance(res);
            })
        } 
    }, [tokenAddress])


    // custom handler for token input change, as it needs to be added as a query param
    const handleTokenChange = (event: React.ChangeEvent<any>) => {
        const value = event.target.value;

        // add the token address as a query param
        if (value) {
            history.push(`/ytc?base_token=${value}`)
        }
        
        formik.handleChange(event);
    }

    // Sets the amount to the user's balance of the base token
    const handleMax: React.MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent) => {
        event.preventDefault()
        formik.setFieldValue('amount', balance);
    }

    return <form onSubmit={formik.handleSubmit}>
        <div id="selects" className="flex flex-row items-center justify-center gap-6 mb-4">
            <Select
                width="36"
                name="tokenAddress"
                rounded="full"
                variant="filled"
                bgColor="#E0E7FF"
                value={formik.values.tokenAddress}
                onChange={handleTokenChange}
                shadow="lg"
            >
                {tokens.map((token) => {
                    return <option value={token.address} key={token.address}>
                        {token.name}
                    </option>
                })}
            </Select>
            <Select
                width="36"
                name="trancheAddress"
                rounded="full"
                variant="filled"
                bgColor="#E0E7FF"
                value={formik.values.trancheAddress}
                onChange={formik.handleChange}
                shadow="lg"
            >
                {
                    tranches && tranches.map((tranche: Tranche) => {
                        return <option value={tranche.address} key={tranche.address}>
                            {(new Date(tranche.expiration * 1000)).toLocaleDateString()}
                        </option>
                    })
                }
            </Select>
        </div>
        <div id="form" className="flex flex-col items-stretch p-6 gap-3 w-full bg-indigo-100 rounded-2xl shadow-lg">
            <div id="table-headers" className="flex flex-row justify-between">
                <div id="percentage-header" className="text-sm">
                    Compounds
                </div>
                <div id="amount-header" className="flex flex-row gap-2 items-center text-sm">
                    <button
                        id="max"
                        onClick={handleMax}
                        className="bg-gray-300 rounded-full text-sm p-1 px-2 hover:bg-gray-400"
                    >
                        MAX
                    </button>
                    <div id="balance">
                        Balance: {balance}                        
                    </div>
                </div>
            </div>
            <div id="table-inputs" className="flex flex-row justify-between items-center">
                <div id="percentage exposure" className="flex p-2 rounded-xl hover:shadow-inner w-1/2">
                    <input
                        type="number"
                        name="compounds"
                        value={formik.values.compounds}
                        placeholder={"0"}
                        onChange={formik.handleChange}
                        id="number-compounds"
                        className="text-lg bg-indigo-100 min-w-0"
                    />
                </div>
                <div id="amount-input" className="flex flex-row rounded-xl gap-2 p-2 hover:shadow-inner w-1/2">
                    <input
                        type="number"
                        name="amount"
                        value={formik.values.amount}
                        placeholder={"0.0"}
                        onChange={formik.handleChange}
                        id="amount-input"
                        className="text-lg text-right bg-indigo-100 min-w-0"/>
                    <div id="amount-input" className="text-lg">{getTokenNameByAddress(formik.values.tokenAddress)}</div>
                </div>
            </div>
        </div>
            <Approval
                tokenAddress={formik.values.tokenAddress}
                tokenName={getTokenNameByAddress(formik.values.tokenAddress)}
                approvalAddress={formik.values.trancheAddress}
                rounded="full"
                bgColor="#6366F1"
                mt="4"
                p="2"
                textColor="gray.50"
                width="full"
            >
                <Button
                    id="approve-calculate-button"
                    rounded="full"
                    bgColor="#6366F1"
                    mt="4"
                    p="2"
                    textColor="gray.50"
                    type="submit"
                    width="full"
                >
                    {simulated ? "RE-SIMULATE" : "SIMULATE"}
                </Button>
            </Approval>
    </form>
}