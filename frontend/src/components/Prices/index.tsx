import React, { useContext, useEffect, useState } from 'react'
import { SignerContext } from '../../hardhat/SymfoniContext';
import { elementAddressesAtom } from '../../recoil/element/atom';
import {useRecoilValue} from 'recoil';
import { getTokenPrice } from '../../features/prices';
import { shortenNumber } from '../../utils/shortenNumber';
import { getYTCSpotPrice } from '../../features/element/ytcSpot';

interface PriceFeedProps {
    price: number | undefined;
    amount: number | undefined;
}

const PriceTag: React.FC<PriceFeedProps> = (props) => {

    const { price, amount } = props;

    let value: string;
    if (price && amount){
        value = shortenNumber(price * amount);
    } else {
        value = "0"
    }


    return (
        <>
            {(parseFloat(value) >= 0) ? `$${value}` : `-$${Math.abs(parseFloat(value))}`}
        </>
    )
}

interface YTPriceTagProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
    trancheAddress: string | undefined;
}

export const YTPriceTag: React.FC<YTPriceTagProps> = (props) => {
    const {amount, baseTokenName, trancheAddress} = props;

    const [price, setPrice] = useState<number>(0);
    const [signer] = useContext(SignerContext);
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        if (baseTokenName && trancheAddress && signer){
            getYTCSpotPrice(baseTokenName, trancheAddress, elementAddresses, signer).then((price) => {
                setPrice(price);
            })
        }
    })


    return (
        <PriceTag
            price={price}
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