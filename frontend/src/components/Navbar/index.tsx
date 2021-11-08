import React from 'react';
import { NavLink } from "react-router-dom";
import { Box } from '@chakra-ui/react';

export const Navbar = () => {
    return (
    <div id="navbar" className="p-3 flex flex-row justify-center items-center gap-6 text-lg font-bold">
        <Box id="navbar-item1" className="h-5" color="text.primary">
            <MyLink to="/ytc" text="YTC"/>
        </Box>
        <Box id="navbar-item2" className="h-5" color="text.primary">
            <MyLink to="/decollateralize" text="DECOLLATERALIZE"/>
        </Box>
        <Box id="navbar-item3" className="h-5" color="text.primary">
            <MyLink to="/ladder" text="LADDER"/>
        </Box>
    </div>)
}

interface MyLinkProps {
    to: any;
    text: string;
}

const MyLink: React.FC<MyLinkProps> = (props) => {
    const {to, text} = props;

    return <NavLink to={to} activeClassName="text-blue-500" color="text.primary" >
        {text}
    </NavLink>
}

export default Navbar;