import * as React from 'react';
import { Link } from 'react-router-dom';
import Wallet from '../Wallet';
import WalletSettings from '../Wallet/Settings';
import componentLogo from '../../images/Component_h_blue.png';
import Navbar from '../Navbar';

export const Header = () => {
    return (
        <div id="header" className="flex flex-col items-center p-2 px-5 justify-between md:flex-row md:items-center">
            <div id="Logo" className="p-2 flex flex-row justify-center md:justify-start md:flex-1 flex-shrink-0">
                <Link to="/">
                    <img src={componentLogo} alt={"Component Logo"} className="h-12 w-30"/>
                </Link>
            </div>
            <Navbar/>
            <div id="wallet" className="p-3 flex flex-row justify-center md:justify-end items-center md:flex-1 gap-1">
                <WalletSettings/>
                <Wallet/>
            </div>
        </div>
    )
}

export default Header;