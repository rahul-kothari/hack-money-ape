import { Box, Button, ButtonProps, Divider, Flex, Select, Spinner, Text } from "@chakra-ui/react";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { BalancerApproval, ERC20Approval } from '../../../../features/approval/Approval';
import { getTokenNameByAddress, YTCInput } from "../../../../features/ytc/ytcHelpers";
import { getActiveTranches, getBalance, getRemainingTrancheYears, getTrancheByAddress } from "../../../../features/element";
import { CurrentAddressContext, ERC20Context, SignerContext, YieldTokenCompoundingContext } from "../../../../hardhat/SymfoniContext";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { isSimulatedSelector, isSimulatingAtom, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { Token, Tranche } from "../../../../types/manual/types";
import * as Yup from 'yup';
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { BaseTokenPriceTag } from "../../../Prices";
import Card from "../../../Reusable/Card";
import { simulateYTCForCompoundRange } from "../../../../features/ytc/simulateYTC";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { TrancheRatesInterface, trancheSelector } from "../../../../recoil/trancheRates/atom";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from "../../../Reusable/DetailItem";

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
    const setNotification = useRecoilState(notificationAtom)[1];

    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const setIsSimulating = useRecoilState(isSimulatingAtom)[1];
    const ytc = useContext(YieldTokenCompoundingContext)
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext)
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [variableApy, setVariableApy] = useState<number | undefined>(undefined);

    const handleSubmit = (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
        const ytcContractAddress = ytc.instance?.address;

        if (
                !!values.tokenAddress &&
                !!values.trancheAddress &&
                !!values.amount &&
                !!ytcContractAddress &&
                !!signer
        ){
            const userData: YTCInput = {
                baseTokenAddress: values.tokenAddress,
                amountCollateralDeposited: values.amount,
                numberOfCompounds: values.compounds ? Math.floor(values.compounds) : 1,
                trancheAddress: values.trancheAddress,
                ytcContractAddress,
                variableApy,
            }

            setIsSimulating(true);
            simulateYTCForCompoundRange(userData, elementAddresses, [1, 8], signer).then(
                (results) => {
                    setSimulationResults(() => {
                        return results;
                    })
                }
            ).catch((error) => {
                setNotification(
                    {
                        text: "Simulation Failed",
                        type: "ERROR"
                    }
                )
            }).finally(() => {
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
                            .min(0.0000000000000000001, 'Amount must be greater than 0')
                            .max((balance ? balance : 0), 'Insufficient balance')
                            .required('An amount of tokens is required'),
                        // compounds: Yup.number()
                        //     .min(1, 'Number of compounds must be 1 or greater')
                        //     .max(10, 'Number of compounds must be 10 or fewer')
                        //     .required('Choose a number of compounds between 1 and 10'),
                        trancheAddress: Yup.string()
                            .required(),
                        tokenAddress: Yup.string()
                            .required(),
                    })
                }
            >
                <Form
                    tokens={tokens}
                    onChange={handleChange}
                    balance={balance}
                    setBalance={setBalance}
                    variableApy={variableApy}
                    setVariableApy={setVariableApy}
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
    variableApy: number | undefined,
    setVariableApy: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Form: React.FC<FormProps> = (props) => {

    const {tokens, onChange, balance, setBalance, setVariableApy} = props;

    const erc20 = useContext(ERC20Context)
    const [currentAddress] = useContext(CurrentAddressContext)
    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const [simulationResults] = useRecoilValue(simulationResultsAtom);
    // const [fixedRate, setFixedRate] = useState<number | undefined>(undefined)
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

    const getTokenNameByAddress = useCallback(
        (tokenAddress: string | undefined): string | undefined => {
            if (!tokenAddress){
                return undefined;
            }
            const token: Token | undefined = tokens.find((token) => {
                return token.address === tokenAddress;
            })
            return token?.name || undefined;
    }, [tokens])

    const updateBalance = useCallback(
        () => {
            if (tokenAddress){
                const tokenContract = erc20.factory?.attach(tokenAddress);
                getBalance(currentAddress, tokenContract).then((res) => {
                    setBalance(res);
                })
            }
        }, [tokenAddress, currentAddress, erc20.factory, setBalance]
    )
    

    const updateTokens = useCallback (
        () => {
            if (tokenAddress){
                getActiveTranches(tokenAddress, elementAddresses).then((res) => {
                    setTranches(res);
                    setFieldValue('trancheAddress', res[0]?.address);
                })
            } 
        }, [tokenAddress, setTranches, setFieldValue, elementAddresses]
    )

    // if there is a token specified in the query params we want to set the value of the form to it
    useEffect(() => {
        if (tokens.length >= 1){
            const tokenAddress = getTokenAddress();
            setFieldValue('tokenAddress', tokenAddress)
        }
    }, [getTokenAddress, tokens, setFieldValue])

    useEffect(() => {
        updateTokens();
        updateBalance();
    }, [tokenAddress, elementAddresses, erc20.factory, currentAddress, setFieldValue, setBalance, updateTokens, updateBalance])

    useEffect(() => {
        updateBalance();
    }, [simulationResults, updateBalance])

    // update variable apy
    useEffect(() => {
        const tokenName = getTokenNameByAddress(tokenAddress);
        if (tokenName){
            getVariableAPY(tokenName, elementAddresses).then((apy) => {
                setVariableApy(apy);
            }).catch((error) => {
                console.error(error)
            })
        }
    }, [elementAddresses, tokenAddress, getTokenNameByAddress, setVariableApy])
    // update fixed apy
    useEffect(() => {
    })


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
                width="40"
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
                width="40"
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
        <Card>
            <Text fontSize="large" fontWeight="extrabold">Select Initial Collateral</Text>
            <Flex
                id="amount-card"
                flexDir="column"
                alignItems="end"
            >
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
                <Flex
                    id="amount-row"
                    flexDir="row"
                    justifyContent="end"
                    rounded="xl"
                    gridGap={2}
                    p={1}
                    _hover={{
                        shadow: "inner"
                    }}
                >
                    <input
                        type="number"
                        name="amount"
                        onBlur={formik.handleBlur}
                        value={formik.values.amount}
                        placeholder={"0.0"}
                        onChange={formik.handleChange}
                        id="amount-input"
                        className={`text-2xl text-right flex-grow bg-indigo-100 min-w-0 ${formik.errors.amount && "text-red-300"}`}/>
                    <Text
                        id="amount-token-label"
                        fontSize="2xl"
                        whiteSpace="nowrap"
                        color="gray.500"
                    >
                        {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                    </Text>
                </Flex>
                <Flex
                    alignSelf="end"
                    fontSize="sm"
                    textColor="gray.500"
                >
                    <BaseTokenPriceTag
                        baseTokenName = {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                        amount = {formik.values.amount}
                    />
                </Flex>
            </Flex>
            <Flex
                p={4}
                flexDir="column"
            >
                { formik.values.trancheAddress && formik.values.tokenAddress && <TrancheDetails
                    trancheAddress={formik.values.trancheAddress}
                    tokenAddress={formik.values.tokenAddress}
                />} 
            </Flex>
        </Card>
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

interface TrancheDetailsProps {
    trancheAddress: string,
    tokenAddress: string,
}

// Fixed rate, and variable rate
const TrancheDetails: React.FC<TrancheDetailsProps> = (props) => {
    const {trancheAddress, tokenAddress} = props;

    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [trancheRate, setTrancheRates] = useRecoilState(trancheSelector(trancheAddress));

    // let trancheExpiration: number | undefined = undefined;

    const handleChangeTrancheRate = useCallback((rateChange: Partial<TrancheRatesInterface>) => {
        setTrancheRates((currentValue) => {
            return {
                ...currentValue,
                ...rateChange,
            }
        })
    }, [setTrancheRates, trancheAddress])

    useEffect(() => {
        // get baseTokenName
        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);

        // get variable rate
        if (baseTokenName){
            getVariableAPY(baseTokenName, elementAddresses).then((apy) => {
                handleChangeTrancheRate({
                    variable: apy
                })
            })
        }
    }, [handleChangeTrancheRate, elementAddresses, getTokenNameByAddress, tokenAddress])

    // TODO get fixed apy
    useEffect(() => {
        handleChangeTrancheRate({
            fixed: 0
        })
    }, [handleChangeTrancheRate])

    useEffect(() => {
        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);
        if (baseTokenName){
            const trancheDict: {[key: string]: Tranche[]} = elementAddresses.tranches;
            const tranches: Tranche[] = trancheDict[baseTokenName];
            const tranche: Tranche | undefined = getTrancheByAddress(trancheAddress, tranches);
            if (tranche){
                handleChangeTrancheRate({
                    daysRemaining: getRemainingTrancheYears(tranche.expiration) * 365
                })
            }
        }

    }, [handleChangeTrancheRate, elementAddresses, getRemainingTrancheYears])

    return <TrancheDisplay
        {...trancheRate}
    />

}

const TrancheDisplay: React.FC<TrancheRatesInterface> = (props) => {

    const {variable, fixed, daysRemaining} = props;

    return <>
        <DetailItem
            name= "Fixed Rate:"
            value={`%${shortenNumber(fixed * 100)}`}
        />
        <DetailItem
            name= "Variable Rate:"
            value={`%${shortenNumber(variable * 100)}`}
        />
        <DetailItem
            name= "Days Remaining:"
            value={`${shortenNumber(daysRemaining)}`}
        />
    </>
}