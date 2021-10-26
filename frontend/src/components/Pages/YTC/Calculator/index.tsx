import { Spinner } from "../../../Reusable/Spinner";
import { Box, Button, Flex, FormLabel, Input, InputGroup, InputRightAddon, Select, Text} from "@chakra-ui/react";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { YTCInput } from "../../../../features/ytc/ytcHelpers";
import { getActiveTranches, getBalance } from "../../../../features/element";
import { CurrentAddressContext, ERC20Context, SignerContext, YieldTokenCompoundingContext } from "../../../../hardhat/SymfoniContext";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { isSimulatingAtom, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { Token, Tranche } from "../../../../types/manual/types";
import * as Yup from 'yup';
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { BaseTokenPriceTag } from "../../../Prices";
import Card from "../../../Reusable/Card";
import { simulateYTCForCompoundRange } from "../../../../features/ytc/simulateYTC";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { ApproveAndSimulateButton } from "./ApproveAndSimulateButton";
import { TrancheDetails } from "./Tranche";
import { TokenIcon } from "../../../Tokens/TokenIcon";
import { InfoTooltip } from "../../../Reusable/Tooltip";
import { AdvancedCollapsable } from "./Advanced";

interface CalculateProps {
    tokens: Token[];
}

export interface FormFields {
    tokenAddress: string | undefined,
    trancheAddress: string | undefined,
    amount: number | undefined,
    compounds: number,
    percentExposure: number,
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

            let compoundRange: [number, number] = [1, 8];
            if (values.compounds > 0){
                compoundRange = [values.compounds-1, values.compounds+1];
            }
            if (values.compounds === 1){
                compoundRange = [1, 3];
            }
            
            simulateYTCForCompoundRange(userData, elementAddresses, compoundRange, signer).then(
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
        compounds: 0,
        percentExposure: 0,
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
                setBalance(undefined);
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
        <Card>
            <Flex
                id="tranche-select"
                flexDir="column"
                alignItems="center"
            >
                <FormLabel>
                    <Flex
                        flexDir="row"
                        alignItems="center"
                        gridGap={2}
                    >
                        Term
                        <InfoTooltip label="Select an active Element Finance Tranche"/>
                    </Flex>
                </FormLabel>
                <Flex
                    id="selects"
                    flexDir={{base: "column", sm: "row"}}
                    justify="center"
                    alignItems="center"
                    mb={4}
                    gridGap={{base: 2, sm: 6}}
                >
                    <Select
                        width="40"
                        name="tokenAddress"
                        rounded="full"
                        variant="filled"
                        bgColor="input_bg"
                        cursor="pointer"
                        value={formik.values.tokenAddress}
                        onChange={handleTokenChange}
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
                        cursor="pointer"
                        variant="filled"
                        bgColor="input_bg"
                        value={formik.values.trancheAddress}
                        onChange={formik.handleChange}
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
                { formik.values.trancheAddress && formik.values.tokenAddress && <TrancheDetails
                    trancheAddress={formik.values.trancheAddress}
                    tokenAddress={formik.values.tokenAddress}
                />} 
            </Flex>
        </Card>
        <Card mt={5}>
            {/* <Text fontSize="large" fontWeight="extrabold">Select Initial Collateral</Text> */}
            <Flex
                id="amount-card"
                p={2}
                flexDir="column"
                alignItems="center"
                gridGap={1}
            >
                <FormLabel
                    flexDir="row"
                    justify="center"
                    alignItems="center"
                >
                    <Flex
                        flexDir="row"
                        alignItems="center"
                        gridGap={2}
                    >
                        Collateral Amount
                        <InfoTooltip label="Yield Token Compounding requires collateral of the base token during the ytc transaction. Only a portion of these tokens will be spent, and the rest will be returned to you when the transaction is complete."/>
                    </Flex>
                </FormLabel>
                <Flex
                    id="amount-header"
                    flexDir="row"
                    gridGap={2}
                    justify="space-between"
                    alignItems="center"
                    fontSize="sm"
                    width="full"
                >
                    <Flex
                        alignItems="center"
                        gridGap={1}
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
                            Balance: {balance ? balance : <Spinner/>}
                        </Box>
                    </Flex>
                </Flex>
                <Flex
                    id="amount-row"
                    flexDir="row"
                    justifyContent="end"
                    width="full"
                    rounded="xl"
                    gridGap={2}
                    p={1}
                    _hover={{
                        shadow: "inner"
                    }}
                >
                    <InputGroup
                        bgColor="input_bg"
                        rounded="2xl"
                    >
                        <Input
                            type="number"
                            name="amount"
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                            // variant="filled"
                            placeholder={"0.0"}
                            onChange={formik.handleChange}
                            id="amount-input"/>
                        <InputRightAddon
                            bgColor="input_bg"
                            color="text.primary"
                        >
                            <Text
                                id="amount-token-label"
                                fontSize="2xl"
                                whiteSpace="nowrap"
                            >
                        {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                    </Text>
                        </InputRightAddon>
                    </InputGroup>
                    <TokenIcon
                        tokenName={getTokenNameByAddress(tokenAddress)}
                    />
                </Flex>
                <Flex
                    alignSelf="start"
                    px={2}
                    fontSize="sm"
                    textColor="gray.500"
                >
                    <BaseTokenPriceTag
                        baseTokenName = {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                        amount = {formik.values.amount}
                    />
                </Flex>
            </Flex>
            <AdvancedCollapsable/>
        </Card>
        <ApproveAndSimulateButton
            formErrors={formik.errors}
            tokenAddress={formik.values.tokenAddress}
            tokenName={getTokenNameByAddress(formik.values.tokenAddress)}
            trancheAddress={formik.values.trancheAddress}
            amount={formik.values.amount}
            rounded="full"
            bgColor="main.primary"
            color="text.secondary"
            mt="4"
            p="2"
            width="full"
            _hover={{
                bgColor:"main.primary_hover"
            }}
        />
    </form>
}