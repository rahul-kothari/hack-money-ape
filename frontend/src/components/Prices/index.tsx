import React from 'react'

interface PriceFeedProps {
    price: number | undefined;
    amount: number | undefined;
}

const PriceFeed: React.FC<PriceFeedProps> = (props) => {

    const { price, amount } = props;

    let value: string;
    if (price && amount){
        value = Math.floor(price * amount).toString();
    } else {
        value = ""
    }


    return (
        <>
            ~${value}
        </>
    )
}

interface YTPriceFeedProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
}

export const YTPriceFeed: React.FC<YTPriceFeedProps> = (props) => {
    const {amount} = props;

    return (
        <PriceFeed
            price={10}
            amount={amount}
        />
    )
}

interface BaseTokenPriceFeedProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
}

export const BaseTokenPriceFeed: React.FC<BaseTokenPriceFeedProps> = (props) => {
    const {amount} = props;

    return (
        <PriceFeed
            price={100}
            amount={amount}
        />
    )
}

export default PriceFeed
