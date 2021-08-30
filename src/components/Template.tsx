import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import { YTC } from './Pages/YTC';

interface Props {
}

export const Template: React.FC<Props> = (props: Props) => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
            <Header/>
            <div id="body" className="p-5 mx-auto max-w-lg w-full">
                <Switch>
                    <Route path="/ytc">
                        <YTC/>
                    </Route>
                    <Route path="/decollateralize">
                        Decollateralize
                    </Route>
                    <Route path="/ladder">
                        Ladder
                    </Route>
                    <Route path="/">
                        Home
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

export default Template
