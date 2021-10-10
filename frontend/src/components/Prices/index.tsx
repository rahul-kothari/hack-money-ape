import { Flex } from '@chakra-ui/layout';
import React from 'react'
import { calcSpotPriceYt } from '../../utils/element/calcSpotPrice';

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
    const {amount} = props;

    return (
        <PriceTag
            price={1}
            amount={amount}
        />
    )
}