import React from 'react';

export const Footer = () => {
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

export default Footer;