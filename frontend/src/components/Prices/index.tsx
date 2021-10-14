import React, { useContext, useEffect, useState } from 'react'
import { calcSpotPriceYt } from '../../utils/element/calcSpotPrice';
import { SignerContext } from '../../hardhat/SymfoniContext';
import { elementAddressesAtom } from '../../recoil/element/atom';
import {useRecoilValue} from 'recoil';
import { getTokenPrice } from '../../features/prices';

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
        <>
            {(parseFloat(value) >= 0) ? `~ $${value}` : `~ -$${Math.abs(parseFloat(value))}`}
        </>
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
            getTokenPrice(baseTokenName, signer).then((value) => {
                setPrice(value);
            }).catch((error) => {
                console.error(error);
            })
        }
    }, [baseTokenName, elementAddresses, signer])


    return (
        <PriceTag
            price={price}
            amount={amount}
        />
    )
}