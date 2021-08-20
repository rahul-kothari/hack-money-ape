import React from 'react'

interface Props {
}

export const Template = (props: Props) => {
    return (
        <>
            <div id="header" className="bg-red-300 flex flex-col items-center p-3 justify-between md:flex-row">
                <div id="Logo" className="bg-yellow-500 p-3">
                    <div id="logo-proxy" className="bg-gray-100 w-60 m-auto" >
                        APY - APe PREDICTED YIELD
                    </div>
                </div>
                <div id="navbar" className="bg-blue-200 p-3 flex flex-row justify-center gap-6">
                    <div id="navbar-item1" className="h-5">
                        YTC
                    </div>
                    <div id="navbar-item2" className="h-5">
                        Decollateralize
                    </div>
                    <div id="navbar-item3" className="h-5">
                        Ladder
                    </div>
                    <div id="navbar-item4" className="h-5">
                        Service4
                    </div>
                </div>
                <div id="wallet" className="bg-green-200 p-3 flex flex-row justify-center gap-6 items-center">
                    <div id="wallet-settings" className="bg-gray-100 w-5 h-5">
                    </div>
                    <div id="wallet" className="bg-gray-100 rounded-2xl py-2 px-3">
                        CONNECT WALLET
                    </div>
                </div>
            </div>
            <div id="body" className="bg-blue-400 p-5 mx-auto max-w-lg">
                <div id="calculate" className="bg-green-500 py-5 flex flex-col gap-3">
                    <div id="title" className="">
                        <h2 className="text-xl font-bold">
                            Calculate YTC
                        </h2>
                    </div>
                    <div id="selects" className="flex flex-row items-center justify-center gap-6 mb-4">
                        <div id="asset-select-proxy" className="rounded-2xl bg-gray-100 flex flex-row py-2 px-3 gap-2">
                            <div id="asset-icon" className="h-6 w-6 bg-blue-400">
                            </div>
                            <div id="asset-name">
                                USDC
                            </div>
                        </div>
                        <div id="tranche-select-proxy" className="rounded-2xl bg-gray-100 py-2 px-3">
                            DEC 20, 2021
                        </div>
                    </div>
                    <div id="form" className="flex flex-col items-stretch p-6 gap-3 w-full bg-gray-500 rounded-2xl">
                        <div id="table-headers" className="flex flex-row justify-between">
                            <div id="percentage-header">
                                Compounds
                            </div>
                            <div id="amount-header" className="flex flex-row gap-2">
                                <div id="max" className="bg-gray-300 rounded-lg text-sm px-1">
                                    MAX
                                </div>
                                <div id="balance">
                                    0.1000
                                </div>
                            </div>
                        </div>
                        <div id="table-inputs" className="flex flex-row justify-between items-center">
                            <div id="percentage exposure">
                                <div id="number-compounds" className="text-lg">
                                    5
                                </div>
                            </div>
                            <div id="amount-input" className="flex flex-row gap-2">
                                <div id="amount-input" className="text-lg">1000</div>
                                <div id="amount-input" className="text-lg">USDC</div>
                            </div>
                        </div>
                    </div>
                    <div id="approve-calculate-button" className="rounded-2xl w-full bg-gray-100 mt-4 p-2">
                        APPROVE USDC
                    </div>
                </div>

                <div id="arrow" className="h-10 bg-gray-100 w-3 mx-auto"></div>
                <div id="ape" className="bg-green-500 py-5 flex flex-col gap-3">
                    <div id="form" className="flex flex-row w-full bg-gray-500 rounded-2xl">
                        <div id="asset" className="bg-blue-200 h-16 rounded-l-2xl border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                            <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                            </div>
                            <div id="asset-details" className="flex-grow text-left">
                                <div id="asset-name">
                                    ePT-CRV3LUSD
                                </div>
                                <div id="asset-date">
                                    Dec 20, 2021
                                </div>
                            </div>

                        </div>
                        <div id="amount" className="bg-yellow-200 h-16 flex-grow rounded-r-2xl flex px-3">
                            <div id="amount-text" className="self-center text-lg">
                                1.000
                            </div>
                        </div>
                    </div>
                    <div id="form" className="flex flex-row w-full bg-gray-500 rounded-2xl">
                        <div id="asset" className="bg-blue-200 h-16 rounded-l-2xl border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                            <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                            </div>
                            <div id="asset-details" className="flex-grow text-left">
                                <div id="asset-name">
                                    yPT-CRV3LUSD
                                </div>
                                <div id="asset-date">
                                    Dec 20, 2021
                                </div>
                            </div>

                        </div>
                        <div id="amount" className="bg-yellow-200 h-16 flex-grow rounded-r-2xl flex px-3">
                            <div id="amount-text" className="self-center text-lg">
                                1.000
                            </div>
                        </div>
                    </div>
                    <div id="ape-button" className="w-full bg-gray-100 rounded-2xl mx-auto p-2">
                        APE
                    </div>
                </div>

            </div>
            <div id="footer" className="fixed bottom-0 w-full">
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
        </>
    )
}

export default Template
