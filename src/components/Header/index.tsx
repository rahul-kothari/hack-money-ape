import * as React from 'react';
import { Link } from 'react-router-dom';
import Wallet from '../Wallet';
import WalletSettings from '../Wallet/Settings';
import apeImage from '../../images/ape.png';
import Navbar from '../Navbar';

export const Header = () => {
    return (
        // <div id="header" className="flex flex-col items-center p-3 justify-between md:flex-row md:items-center">
        <div id="header" className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1">
            <div id="Logo" className="-m-4 flex flex-row justify-center md:justify-start">
                <Link to="/">
                    <img src={apeImage} alt={"APY"} className="h-32 w-32"/>
                </Link>
            </div>
            <Navbar/>
            <div id="wallet" className="p-3 flex flex-row justify-center md:justify-end gap-3 items-center">
                <WalletSettings/>
                <Wallet/>
            </div>
        </div>
    )
}

export default Header;