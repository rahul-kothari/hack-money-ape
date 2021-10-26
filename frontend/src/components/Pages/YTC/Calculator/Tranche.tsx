import { useCallback, useContext, useEffect } from "react";
import { getRemainingTrancheYears, getTrancheByAddress } from "../../../../features/element";
import { getFixedRate } from "../../../../features/element/fixedRate";
import { getTokenNameByAddress } from "../../../../features/ytc/ytcHelpers";
import { SignerContext } from "../../../../hardhat/SymfoniContext";
import { TrancheRatesInterface, trancheSelector } from "../../../../recoil/trancheRates/atom";
import { Tranche } from "../../../../types/manual/types";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from "../../../Reusable/DetailItem";
import { useRecoilValue, useRecoilState } from 'recoil';
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { Spinner } from "../../../Reusable/Spinner";
import { DetailPane } from "../../../Reusable/DetailPane";


interface TrancheDetailsProps {
    trancheAddress: string,
    tokenAddress: string,
}

// Fixed rate, variable rate, and number of days remaining, should be displayed
export const TrancheDetails: React.FC<TrancheDetailsProps> = (props) => {
    const {trancheAddress, tokenAddress} = props;

    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext);
    const [trancheRate, setTrancheRates] = useRecoilState(trancheSelector(trancheAddress));

    const handleChangeTrancheRate = useCallback((rateChange: Partial<TrancheRatesInterface>) => {
        setTrancheRates((currentValue) => {
            return {
                ...currentValue,
                ...rateChange,
            }
        })
    }, [setTrancheRates])

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
    }, [handleChangeTrancheRate, elementAddresses, tokenAddress])

    useEffect(() => {
        // get baseTokenName
        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);

        if (baseTokenName && signer){
            getFixedRate(baseTokenName, trancheAddress, elementAddresses, signer).then((fixedRate) => {
                handleChangeTrancheRate({
                    fixed: fixedRate
                })
            }).catch((error) => {
                console.error(error);
            })
        }
    }, [handleChangeTrancheRate, signer, trancheAddress, elementAddresses, tokenAddress])

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

    }, [handleChangeTrancheRate, elementAddresses, tokenAddress, trancheAddress])

    return <TrancheDisplay
        {...trancheRate}
    />

}

const TrancheDisplay: React.FC<TrancheRatesInterface> = (props) => {

    const {variable, fixed, daysRemaining} = props;

    return <DetailPane>
        <DetailItem
            name= "Fixed Rate:"
            value={ 
                fixed ? 
                    `${shortenNumber(fixed * 100)}%`: 
                    <>
                        <Spinner/>%
                    </>
            }
        />
        <DetailItem
            name= "Variable Rate:"
            value={
                variable ? 
                    `${shortenNumber(variable * 100)}%`: 
                    <>
                        <Spinner/>%
                    </>
            }
        />
        <DetailItem
            name= "Days Remaining:"
            value={
                daysRemaining ? 
                    shortenNumber(daysRemaining) : 
                    <>
                        <Spinner/>
                    </>
            }
        />
    </DetailPane>
}