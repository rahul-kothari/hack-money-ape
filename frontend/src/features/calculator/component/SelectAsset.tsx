import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

interface Props {
    basePath: string;
    assets: {[name: string]: string}
}

export const SelectAsset: React.FC<Props> = (props) => {
    const { assets, basePath } = props;

    return (
        <>
            <Text>
                Select the base Asset
            </Text>
            <Flex
                flexDirection = {{base: 'column', md: 'row'}}
                justifyContent = "space-between"
                alignItems = "center"
            >
                {Object.entries(assets).map(([assetName, assetAddress]) => {
                    return <Link
                        to={`${basePath}/${assetAddress}`}
                    >
                        <Box
                            backgroundColor = {'gray.200'}
                            rounded = {'lg'}
                            shadow = {'md'}
                            px = {3}
                            py = {3}
                            margin = {1}
                        >
                            {assetName.toUpperCase()}
                        </Box>
                    </Link>
                })}
            </Flex>
        </>
    )
}

export default SelectAsset
