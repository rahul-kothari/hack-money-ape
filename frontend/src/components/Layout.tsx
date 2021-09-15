import React from 'react'
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Template from './Template';

export const Layout = () => {
  return (
    <div>
        <Router>
          <Template />
        </Router>
    </div>
  )
}

export default Layout;