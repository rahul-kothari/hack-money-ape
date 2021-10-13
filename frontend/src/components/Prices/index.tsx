import { Flex } from '@chakra-ui/layout';
import React, { useContext, useEffect, useState } from 'react'
import { calcSpotPriceYt } from '../../utils/element/calcSpotPrice';
import { CoingeckoTokenName, getRelativePriceFromCoingecko, isCoingeckoToken } from '../../features/prices/coingecko';
import { getPriceOfCurveLP, isCurveToken } from '../../features/prices/curve';
import { SignerContext } from '../../hardhat/SymfoniContext';
import { elementAddressesAtom } from '../../recoil/element/atom';
import {useRecoilValue} from 'recoil';

interface PriceFeedProps {
    price: number | undefined;
    amount: number | undefined;
}

const PriceTag: React.FC<PriceFeedProps> = (props) => {

    const { price, amount } = props;

    let value: string;
    if (price && amount){
        value = Math.floor(price * amount).toString();
    } else {
        value = ""
    }


    return (
        <Flex
            textColor="gray.500"
            fontSize="sm"
        >
            ~${value}
        </Flex>
    )
}

interface YTPriceTagProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
}

export const YTPriceTag: React.FC<YTPriceTagProps> = (props) => {
    // get balancer pool reserves

    const baseReserves = "0";
    const ytReserves = "0";

    // eslint-disable-next-line
    const price = calcSpotPriceYt(baseReserves, ytReserves);

    const {amount} = props;

    return (
        <PriceTag
            price={0.1}
            amount={amount}
        />
    )
}

interface BaseTokenPriceTagProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
}

export const BaseTokenPriceTag: React.FC<BaseTokenPriceTagProps> = (props) => {
    const {amount, baseTokenName} = props;

    const [price, setPrice] = useState<number>(0);
    const [signer] = useContext(SignerContext);
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        if(baseTokenName){
            if (isCoingeckoToken(baseTokenName.toLowerCase())){
                getRelativePriceFromCoingecko(baseTokenName?.toLowerCase(), "usd").then((value: number) => {
                    setPrice(value)
                })
            } else {
                if (isCurveToken(baseTokenName.toLowerCase()) && signer){
                    getPriceOfCurveLP(baseTokenName.toLowerCase(), elementAddresses, signer).then((value: number) => {
                        setPrice(value)
                    })
                }
            }
        }
    }, [baseTokenName])


    return (
        <PriceTag
            price={price}
            amount={amount}
        />
    )
}