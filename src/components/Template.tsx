import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import { YTC } from './Pages/YTC';

interface Props {
}

export const Template: React.FC<Props> = (props: Props) => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
            <Header/>
            <div id="body" className="p-5 mx-auto max-w-lg w-full flex-1">
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
            <Footer/>
        </div>
    )
}

export default Template
