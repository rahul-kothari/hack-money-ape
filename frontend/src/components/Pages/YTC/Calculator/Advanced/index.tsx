import { useState } from "react";
import {Flex, Button, Collapse, Tabs, TabList, Tab, TabPanels, TabPanel, InputGroup, Input, InputRightAddon, Text} from '@chakra-ui/react'
import { useFormikContext } from "formik";
import { useRecoilValue } from "recoil";
import { trancheSelector } from "../../../../../recoil/trancheRates/atom";
import { getCompoundsFromTargetExposure } from "../../../../../features/ytc/simulateYTC";
import { FormFields } from "..";
import { InfoTooltip } from "../../../../Reusable/Tooltip";

export const AdvancedCollapsable: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    const handleToggle = () => setShow(!show);

    return <Flex flexDir="column" alignItems="center">
        <Button variant="link" onClick={handleToggle} gridGap={2}>
            Advanced Options
            <InfoTooltip label="The simulator will by default run with 1-8 compounds. Advanced options allow you to change this by selecting either the number of compounds you want to simulate, or the percentage of your collateral you want to spend."/>
        </Button>
        <Collapse in={show}>
            <AdvancedForm/>
        </Collapse>
    </Flex>

}


const AdvancedForm = () => {
    return <Flex flexDir="column" alignItems="center">
        <Tabs>
            <TabList>
                <Tab>Number of Compounds</Tab>
                <Tab>Percentage Exposure</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <NumberCompoundsField/>
                </TabPanel>
                <TabPanel>
                    <PercentageExposureField/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Flex>
}

const PercentageExposureField = () => {
    const formik = useFormikContext<FormFields>();

    const trancheRate = useRecoilValue(trancheSelector(formik.values.trancheAddress || "null"));
    const fixedRate: number | undefined = trancheRate.fixed;
    const daysRemaining: number | undefined = trancheRate.daysRemaining;

    // Set the number of compounds based on the desired target exposure
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        formik.handleChange(e);
        console.log(fixedRate);
        if (fixedRate && daysRemaining){
            const estimatedCompounds = getCompoundsFromTargetExposure(fixedRate, parseFloat(e.target.value), daysRemaining);
            console.log(estimatedCompounds);
            formik.setFieldValue("compounds", estimatedCompounds)
        }
    }

    return <InputGroup
        bgColor="text.primary"
        rounded="2xl"
    >
        <Input
            type="number"
            name="percentExposure"
            onBlur={formik.handleBlur}
            value={formik.values.percentExposure}
            // variant="filled"
            placeholder={"0"}
            onChange={handleChange}
            id="amount-input"/>
        <InputRightAddon
            bgColor="text.primary"
        >
            <Text
                id="amount-token-label"
                fontSize="2xl"
                whiteSpace="nowrap"
                color="gray.500"
            >
                %
            </Text>
        </InputRightAddon>
    </InputGroup>
}

const NumberCompoundsField = () => {
    const formik = useFormikContext<FormFields>();

    return <InputGroup
            bgColor="text.primary"
            rounded="2xl"
        >
            <Input
                type="number"
                name="compounds"
                onBlur={formik.handleBlur}
                value={formik.values.compounds}
                // variant="filled"
                placeholder={"0"}
                onChange={formik.handleChange}
                id="amount-input"/>
                <InputRightAddon
                    bgColor="text.primary"
                >
                    Compounds
                </InputRightAddon>
        </InputGroup>
}