import React from 'react'
import { Link, NavLink, Route, Switch } from 'react-router-dom';
import Wallet from '../features/wallet/Wallet';
import apeImage from '../images/ape.png';
import {Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger} from '@chakra-ui/react';

interface Props {
}

export const Template = (props: Props) => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
            <Header/>
            <div id="body" className="p-5 mx-auto max-w-lg w-full">
                <Switch>
                    <Route path="/ytc">
                        <div>
                            <div id="title" className="">
                                <h2 className="text-2xl font-bold">
                                    Yield Token Compounding
                                </h2>
                            </div>
                            <Calculate/>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </svg>

                            <Ape/>
                        </div>
                    </Route>
                    <Route path="/decollateralize">

                    </Route>
                    <Route path="/ladder">
                    </Route>
                    <Route path="/">
                        HOME
                    </Route>
                </Switch>


            </div>
            <div id="footer" className="">
                <div className="h-20 flex flex-row items-center justify-between p-5 ">
                    <div id="social-icons" className="flex flex-row gap-4">
                        <div id="proxy-discord" className="h-8 w-8 bg-gray-400"></div>
                        <div id="proxy-twitter" className="h-8 w-8 bg-gray-400"></div>
                        <div id="proxy-github" className="h-8 w-8 bg-gray-400"></div>
                    </div>
                    <div id="other-links" className="flex flex-row gap-4">
                        <div>
                            FAQ
                        </div>
                        <div>
                            Docs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Header = () => {
    return (
        <div id="header" className="flex flex-col items-center p-3 justify-between md:flex-row md:items-start">
            <div id="Logo" className="-m-6">
                <Link to="/">
                    <img src={apeImage} alt={"APY"} className="h-32 w-32"/>
                </Link>
            </div>
            <Navbar/>
            <div id="wallet" className="p-3 flex flex-row justify-center gap-3 items-center">
                <WalletSettings/>
                <Wallet/>
            </div>
        </div>
    )
}

const WalletSettings = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            </PopoverTrigger>
            <PopoverContent>
                {/* <PopoverArrow/> */}
                <PopoverCloseButton/>
                <PopoverHeader>Settings</PopoverHeader>
                <PopoverBody>
                    This is where settings go
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

const Navbar = () => {
    return (
    <div id="navbar" className="p-3 flex flex-row justify-center gap-6 text-lg">
        <div id="navbar-item1" className="h-5">
            <NavLink to="/ytc" activeClassName="text-indigo-300">
                YTC
            </NavLink>
        </div>
        <div id="navbar-item2" className="h-5">
            <NavLink to="/decollateralize" activeClassName="text-indigo-300">
                Decollateralize
            </NavLink>
        </div>
        <div id="navbar-item3" className="h-5">
            <NavLink to="/ladder" activeClassName="text-indigo-300">
                Ladder
            </NavLink>
        </div>
        {/* <div id="navbar-item4" className="h-5">
            Service4
        </div> */}
    </div>)
}

const Calculate = () => {
    return (
        <div id="calculate" className="py-5 flex flex-col gap-3">
            <div id="selects" className="flex flex-row items-center justify-center gap-6 mb-4">
                <div id="asset-select-proxy" className="rounded-full bg-indigo-100 flex flex-row py-2 px-3 gap-2 items-center hover:bg-indigo-200 cursor-pointer">
                    <div id="asset-icon" className="h-6 w-6 bg-blue-400">
                    </div>
                    <div id="asset-name">
                        USDC
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div id="asset-select-proxy" className="rounded-full bg-indigo-100 flex flex-row py-2 px-3 gap-2 items-center hover:bg-indigo-200 cursor-pointer">
                    <div id="tranche-select-proxy">
                        DEC 20, 2021
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <div id="form" className="flex flex-col items-stretch p-6 gap-3 w-full bg-indigo-100 rounded-2xl">
                <div id="table-headers" className="flex flex-row justify-between">
                    <div id="percentage-header" className="text-sm">
                        Compounds
                    </div>
                    <div id="amount-header" className="flex flex-row gap-2 items-center text-sm">
                        <button id="max" className="bg-gray-300 rounded-full text-sm p-1 px-2 hover:bg-gray-400">
                            MAX
                        </button>
                        <div id="balance">
                            Balance: 0.1000
                        </div>
                    </div>
                </div>
                <div id="table-inputs" className="flex flex-row justify-between items-center">
                    <div id="percentage exposure" className="flex p-2 hover:shadow-inner w-1/2">
                        <input type="number" placeholder="0" id="number-compounds" className="text-lg bg-indigo-100 min-w-0"/>
                    </div>
                    <div id="amount-input" className="flex flex-row gap-2 p-2 hover:shadow-inner w-1/2">
                        <input type="number" placeholder="0" id="amount-input" className="text-lg text-right bg-indigo-100 min-w-0"/>
                        <div id="amount-input" className="text-lg">USDC</div>
                    </div>
                </div>
            </div>
            <button id="approve-calculate-button" className="rounded-full w-full bg-indigo-500 mt-4 p-2 text-gray-50 hover:bg-indigo-400">
                SIMULATE
            </button>
        </div>
    )

}

const Ape = () => {
    return (
        <div id="ape" className="py-5 flex flex-col gap-3">
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left">
                        <div id="asset-name">
                            ePT-CRV3USDC
                        </div>
                        <div id="asset-date">
                            Dec 20, 2021
                        </div>
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        1.000
                    </div>
                </div>
            </div>
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left">
                        <div id="asset-name">
                            eYT-CRV3USDC
                        </div>
                        <div id="asset-date">
                            Dec 20, 2021
                        </div>
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        1.000
                    </div>
                </div>
            </div>
            <button id="ape-button" className="w-full bg-indigo-500 rounded-full mx-auto p-2 text-gray-50 hover:bg-indigo-400">
                APE
            </button>
        </div>
    )
}

const Footer = () => {
    return (
        <div id="footer" className="">
            <div className="h-20 flex flex-row items-center justify-between p-5 ">
                <div id="social-icons" className="flex flex-row gap-4">
                    <div id="proxy-discord" className="h-8 w-8 bg-gray-400"></div>
                    <div id="proxy-twitter" className="h-8 w-8 bg-gray-400"></div>
                    <div id="proxy-github" className="h-8 w-8 bg-gray-400"></div>
                </div>
                <div id="other-links" className="flex flex-row gap-4">
                    <div>
                        FAQ
                    </div>
                    <div>
                        Docs
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Template
