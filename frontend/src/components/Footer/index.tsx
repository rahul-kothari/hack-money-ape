import { Box } from '@chakra-ui/layout';
import React from 'react';
import discordLogo from '../../images/Discord-Logo-White.svg';
import githubLogo from '../../images/GitHub-Mark-Light-64px.png';
import twitterLogo from '../../images/TwitterLogo.svg';

export const Footer = () => {
    return (
        <Box id="footer" textColor="text.primary">
            <div className="h-20 flex flex-row items-center justify-between p-5 ">
                <div id="social-icons" className="flex flex-row gap-4">
                    <div id="proxy-discord" className="h-8 w-8">
                        <img src={discordLogo} alt={"Discord Logo"}/>
                    </div>
                    <div id="proxy-github" className="h-8 w-8">
                        <img src={githubLogo} alt={"Github Logo"}/>
                    </div>
                    <div id="proxy-twitter" className="h-8 w-8">
                        <img src={twitterLogo} alt={"Twitter Logo"}/>
                    </div>
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
        </Box>
    )
}

export default Footer;