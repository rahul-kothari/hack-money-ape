import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { useContext } from "react";
import { BalancerApproval, ERC20Approval } from "../../../../features/approval/Approval";
import { YieldTokenCompoundingContext } from "../../../../hardhat/SymfoniContext";
import { useRecoilValue } from 'recoil';
import { isSimulatedSelector, isSimulatingAtom } from "../../../../recoil/simulationResults/atom";

interface ApproveAndSimulateButtonProps {
    tokenAddress: string | undefined;
    tokenName: string | undefined;
    trancheAddress: string | undefined;
    formErrors: {[fieldName: string]: string | undefined}
}


export const ApproveAndSimulateButton: React.FC<ApproveAndSimulateButtonProps & ButtonProps> = (props) => {
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