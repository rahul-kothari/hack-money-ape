import * as React from 'react';
import { Link } from 'react-router-dom';
import Wallet from '../Wallet';
import WalletSettings from '../Wallet/Settings';
import componentLogo from '../../images/Component_h_blue.png';
import { Flex, Icon } from '@chakra-ui/react';

export const Header = () => {
    return (
        <div id="header" className="flex flex-col items-center p-2 px-5 justify-between md:flex-row md:items-center">
            <div id="Logo" className="p-2 flex flex-row justify-center md:justify-start md:flex-1 flex-shrink-0">
                <Link to="/">
                    <img src={componentLogo} alt={"Component Logo"} className="h-8 w-30"/>
                </Link>
            </div>
            <div id="wallet" className="p-3 flex flex-row justify-center md:justify-end items-center md:flex-1 gap-1">
                <WalletSettings
                    icon={<GearIcon/>}
                />
                <Wallet/>
            </div>
        </div>
    )
}

const GearIcon = () => {
    return <Flex p={2} justifyContent="center" alignItems="center" tabIndex={0} rounded="full" cursor="pointer">
        {/** This is a gear icon */}
        <Icon viewBox="0 0 20 20" color="text.primary" h={5} w={5} stroke="text.primary" fill="text.primary">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </Icon>
    </Flex>
}

export default Header;
