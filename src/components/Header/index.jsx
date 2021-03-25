import React from 'react';

import Flex from '../../common/Flex';
import { WHITE } from '../../constants';
import './header.scss';
import SettingsMenu from '../SettingsMenu';
import { Box, Text } from '@chakra-ui/react';
import Font from '../../common/Font';
import { useHistory } from 'react-router-dom';
// import Logo from '../Logo';
import { useGlobalState } from '../../providers/root';
import { AiOutlinePlus } from 'react-icons/ai';

const Header = () => {
    const { meta, firebase } = useGlobalState();
    const history = useHistory();
    const fixed = {
        position: 'fixed',
        top: 0,
        width: "100%",
        zIndex: 6
    }

    return (
        <Flex style={{ ...fixed }} transitionBackground display="flex" backgroundColor="#ffffff00" alignItems="center" padding={meta.isInstalled ? "50px 20px 15px 20px" : "15px 20px"}>
            <Flex display="flex" direction="column" justifyContent="center">
                <Flex onClick={() => history.push("/")} display="flex" direction="row" margin="0px 0px 0px 0px" hoverCursor alignItems="center">
                    {/* <Logo /> */}
                    <Box marginRight={2} />
                    <Text fontWeight="bold">Friendar</Text>
                </Flex>
            </Flex>
            <Flex />
            <Flex flexGrow="none" margin="0px 10px 0px 0px" />
            {!meta.isInstalled && <SettingsMenu />}
        </Flex>
    )
};

export default Header;
