import { Box, Button, ButtonProps, Flex, Select, Spinner, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { BalancerApproval, ERC20Approval } from '../../../features/approval/Approval';
import { calculateYieldExposures, YieldExposureData } from "../../../features/calculator/calculatorAPI";
import { getActiveTranches, getBalance } from "../../../features/element";
import { CurrentAddressContext, ERC20Context, SignerContext, YieldTokenCompoundingContext } from "../../../hardhat/SymfoniContext";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { isSimulatedSelector, isSimulatingAtom, simulationResultsAtom } from "../../../recoil/simulationResults/atom";
import { Token, Tranche } from "../../../types/manual/types";
import * as Yup from 'yup';

interface CalculateProps {
    tokens: Token[];
}

export interface FormFields {
    tokenAddress: string | undefined,
    trancheAddress: string | undefined,
    amount: number | undefined,
    compounds: number | undefined
}

export const Calculator: React.FC<CalculateProps> = (props: CalculateProps) => {
    const {tokens} = props;

    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const setIsSimulating = useRecoilState(isSimulatingAtom)[1];
    const ytc = useContext(YieldTokenCompoundingContext)
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext)
    const [balance, setBalance] = useState<number | undefined>(undefined);

    const handleSubmit = (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
        const ytcContractAddress = ytc.instance?.address;

        if (
                !!values.tokenAddress &&
                !!values.trancheAddress &&
                !!values.amount &&
                !!ytcContractAddress &&
                !!signer
        ){
            const userData: YieldExposureData = {
                baseTokenAddress: values.tokenAddress,
                amountCollateralDeposited: BigNumber.from(values.amount),
                numberOfCompounds: values.compounds || 1,
                trancheAddress: values.trancheAddress,
                ytcContractAddress,
            }

            setIsSimulating(true);
            calculateYieldExposures(userData, elementAddresses, [userData.numberOfCompounds, userData.numberOfCompounds + 1], signer).then(
                (results) => {
                    setSimulationResults(() => {
                        return results;
                    })
                }
            ).finally(() => {
                setIsSimulating(false);
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        setSimulationResults([]);
    }

    const initialValues: FormFields = {
        tokenAddress: undefined,
        trancheAddress: undefined,
        amount: 0,
        compounds: 1
    }

    return (
        <Flex
            py={5}
            flexDir="column"
            gridGap={3}
        >

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={
                    Yup.object({
                        amount: Yup.number()
                            .min(0.0000000000000000001)
                            .max((balance ? balance : 0)),
                        compounds: Yup.number()
                            .min(1)
                            .max(10)
                    })
                }
            >
                <Form
                    tokens={tokens}
                    onChange={handleChange}
                    balance={balance}
                    setBalance={setBalance}
                />
            </Formik>
        </Flex>
    )

}

// TOOD this can be moved to a utility
function useQuery() {
    return new URLSearchParams(useLocation().search);
}


interface FormProps {
    tokens: Token[];
    onChange: (e: React.ChangeEvent<any>) => void;
    balance: number | undefined,
    setBalance: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Form: React.FC<FormProps> = (props) => {

    const {tokens, onChange, balance, setBalance} = props;

    const erc20 = useContext(ERC20Context)
    const [currentAddress] = useContext(CurrentAddressContext)
    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const elementAddresses = useRecoilValue(elementAddressesAtom)
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
        if (tokens.length >= 1){
            const tokenAddress = getTokenAddress();
            setFieldValue('tokenAddress', tokenAddress)
        }
    }, [getTokenAddress, tokens, setFieldValue])

    useEffect(() => {
        // if the token is selected then put it in
        if (tokenAddress){
            getActiveTranches(tokenAddress, elementAddresses).then((res) => {
                setTranches(res);
                setFieldValue('trancheAddress', res[0]?.address);
            })
            const tokenContract = erc20.factory?.attach(tokenAddress);
            getBalance(currentAddress, tokenContract).then((res) => {
                setBalance(res);
            })
        } 
    }, [tokenAddress, elementAddresses, erc20.factory, currentAddress, setFieldValue])


    // custom handler for token input change, as it needs to be added as a query param
    const handleTokenChange = (event: React.ChangeEvent<any>) => {
        const value = event.target.value;

        // add the token address as a query param
        if (value) {
            history.push(`/ytc?base_token=${value}`)
            // amount should be set to zero on token change
            formik.setFieldValue('amount', 0)
        }
        
        formik.handleChange(event);
    }

    // Sets the amount to the user's balance of the base token
    const handleMax: React.MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent) => {
        event.preventDefault()
        formik.setFieldValue('amount', balance);
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        formik.handleChange(e);
        onChange(e);
    }

    return <form onSubmit={formik.handleSubmit} onChange={handleChange}>
        <Flex
            id="selects"
            flexDir="row"
            justify="center"
            alignItems="center"
            mb={4}
            gridGap={6}
        >
            <Select
                width="36"
                name="tokenAddress"
                rounded="full"
                variant="filled"
                bgColor="indigo.100"
                value={formik.values.tokenAddress}
                onChange={handleTokenChange}
                shadow="lg"
            >
                {tokens.map((token) => {
                    return <option value={token.address} key={token.address}>
                        {token.name.toUpperCase()}
                    </option>
                })}
            </Select>
            <Select
                width="36"
                name="trancheAddress"
                rounded="full"
                variant="filled"
                bgColor="indigo.100"
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
        </Flex>
        <Flex
            id="parameters"
            flexDir="column"
            alignItems="stretch"
            p={6}
            gridGap={3}
            w="full"
            bgColor="indigo.100"
            rounded="2xl"
            shadow="lg"
        >
            <Flex
                id="table-headers"
                flexDir="row"
                justify="space-between"
                fontSize="sm"
            >
                <Flex
                    id="compounds-header"
                    alignItems="center"
                    fontSize="sm"
                >
                    Compounds
                </Flex>
                <Flex
                    id="amount-header"
                    flexDir="row"
                    gridGap={2}
                    alignItems="center"
                    fontSize="sm"
                >

                        <Button
                            id="max"
                            onClick={handleMax}
                            bg="gray.300"
                            rounded="xl"
                            fontSize="sm"
                            py={0}
                            h="20px"
                            px={2}
                            _hover={
                                {
                                    bg: "gray.400"
                                }
                            }
                        >
                            MAX
                        </Button>
                        <Box
                            id="balance"
                        >
                            Balance: {balance}                        
                        </Box>
                </Flex>
            </Flex>
            <Flex
                id="table-inputs"
                flexDir="row"
                justify="space-between"
                alignItems="center"
            >
                <Flex
                    id="compounds"
                    p={2}
                    rounded="xl"
                    w="50%"
                    _hover={{
                        shadow: "inner"
                    }}
                >

                    <input
                        type="number"
                        name="compounds"
                        value={formik.values.compounds}
                        placeholder={"0"}
                        onChange={formik.handleChange}
                        id="number-compounds"
                        className="text-lg bg-indigo-100 min-w-0"
                    />
                </Flex>
                <Flex
                    id="amount"
                    flexDir="row"
                    p={2}
                    rounded="xl"
                    gridGap={2}
                    w="50%"
                    _hover={{
                        shadow: "inner"
                    }}
                >
                    <input
                        type="number"
                        name="amount"
                        value={formik.values.amount}
                        placeholder={"0.0"}
                        onChange={formik.handleChange}
                        id="amount-input"
                        className={`text-lg text-right bg-indigo-100 min-w-0 ${formik.errors.amount && "text-red-400"}`}/>
                    <Text
                        id="amount-token-label"
                        fontSize="lg"
                        whiteSpace="nowrap"
                    >
                        {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
        <ApproveAndSimulateButton
            formErrors={formik.errors}
            tokenAddress={formik.values.tokenAddress}
            tokenName={getTokenNameByAddress(formik.values.tokenAddress)}
            trancheAddress={formik.values.trancheAddress}
            rounded="full"
            bgColor="#6366F1"
            mt="4"
            p="2"
            textColor="gray.50"
            width="full"
            _hover={{
                bgColor:"#indigo.400"
            }}
        />
    </form>
}

interface ApproveAndSimulateButtonProps {
    tokenAddress: string | undefined;
    tokenName: string | undefined;
    trancheAddress: string | undefined;
    formErrors: {[fieldName: string]: string | undefined}
}


const ApproveAndSimulateButton: React.FC<ApproveAndSimulateButtonProps & ButtonProps> = (props) => {
    const ytc = useContext(YieldTokenCompoundingContext);

    const { tokenAddress, tokenName, trancheAddress, formErrors, ...rest} = props;

    return <BalancerApproval
        trancheAddress={trancheAddress}
        {...rest}
    >
        <ERC20Approval
            tokenAddress={tokenAddress}
            tokenName={tokenName}
            approvalAddress={ytc.instance?.address}
            {...rest}
        >
            <SimulateButton 
                formErrors={formErrors}
                {...rest}
            />
        </ERC20Approval>
    </BalancerApproval>
}

interface SimulateButtonProps {
    formErrors: {[fieldName: string]: string | undefined}
}

const SimulateButton: React.FC<SimulateButtonProps & ButtonProps> = (props) => {
    const isSimulating = useRecoilValue(isSimulatingAtom)

    const isSimulated = useRecoilValue(isSimulatedSelector)

    const { formErrors, ...rest} = props;

    const areNoErrors =  Object.values(formErrors).every((error) => {
            return !error
        })

    return <Button
        id="approve-calculate-button"
        type="submit"
        {...rest}
        disabled={!areNoErrors}
    >
        {
            isSimulating ? 
                <Spinner/> : 
                isSimulated ? 
                    "RE-SIMULATE" :
                    "SIMULATE"
            
        }
    </Button>
}