import { Box, Link } from '@chakra-ui/layout';
import React from 'react';
import githubLogo from '../../images/Github/GitHub-Mark-64px.png';

const GITHUB_REPO = "https://github.com/rahul-kothari/hack-money-ape";

export const Footer: React.FC<{}> = () => {
    return (
        <Box id="footer" textColor="text.primary">
            <div className="h-20 flex flex-row items-center justify-end p-5 ">
                <div id="social-icons" className="flex flex-row gap-4">
                    <Link href={GITHUB_REPO} target="_blank">
                        <div id="proxy-github" className="h-8 w-8">
                            <img src={githubLogo} alt={"Github Logo"}/>
                        </div>
                    </Link>
                </div>
            </div>
        </Box>
    )
}

export default Footer;