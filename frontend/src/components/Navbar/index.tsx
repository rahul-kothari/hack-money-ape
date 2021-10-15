import React from 'react';
import { NavLink } from "react-router-dom";

export const Navbar = () => {
    return (
    <div id="navbar" className="p-3 flex flex-row justify-center items-center gap-6 text-lg font-bold">
        <div id="navbar-item1" className="h-5">
            <NavLink to="/ytc" activeClassName="text-indigo-500">
                YTC
            </NavLink>
        </div>
        <div id="navbar-item2" className="h-5">
            <NavLink to="/decollateralize" activeClassName="text-indigo-500">
                Decollateralize
            </NavLink>
        </div>
        <div id="navbar-item3" className="h-5">
            <NavLink to="/ladder" activeClassName="text-indigo-500">
                Ladder
            </NavLink>
        </div>
    </div>)
}

export default Navbar;