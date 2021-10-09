import { Flex } from '@chakra-ui/layout';
import React from 'react'

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