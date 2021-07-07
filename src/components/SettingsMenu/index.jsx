import React from 'react';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    Box,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { BACKGROUND_COLOR_HW, BACKGROUND_COLOR_HW_DARK, BLUE, PRIMARY_COLOR_SCHEME } from '../../constants';
import { BiMenu } from 'react-icons/bi';
import { checkForFirebaseAuth, signInWithGoogle, signOutWithGoogle } from '../../api/firebase';
// import Authenticated from '../Authenticated';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useGlobalState } from '../../providers/root';
import Authenticated from '../Authenticated';

const SettingsMenu = () => {
    const { dispatch, firebase, meta } = useGlobalState();
    const toast = useToast();
    const history = useHistory();

    const showSuccessToast = () => {
        toast({
            title: "Authenticated",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: 'top'
        })
    }
    const showInfoToast = () => {
        toast({
            title: "See ya!",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: 'top'
        })
    }
    return (
        <Menu autoSelect={false}>
            <MenuButton borderRadius="100px" rightIcon="chevron-down" isDisabled={firebase.isValidatingAuthentication}>
                <SettingsMenuButton firebase={firebase} meta={meta} />
            </MenuButton>
            <MenuList>
                <MenuGroup title={firebase.isAuthenticated ? "Authenticated" : "Authentication"}>
                    {firebase.isAuthenticated ? (
                        <Authenticated />
                    ) : (
                            <MenuItem onClick={() => signInWithGoogle(dispatch, showSuccessToast)}>
                                <FontAwesomeIcon color={BLUE} icon={faGoogle} />
                                <Box mr={3} />
                                Sign In With Google
                            </MenuItem>
                        )}
                </MenuGroup>
                <MenuGroup>
                    <MenuDivider />
                    <MenuItem onClick={() => history.push("/about")}>About</MenuItem>
                </MenuGroup>
                <MenuGroup>
                    {firebase.isAuthenticated && (
                        <>
                            <MenuDivider />
                            <MenuItem onClick={() => signOutWithGoogle(dispatch, showInfoToast, history)}>Sign Out</MenuItem>
                        </>
                    )}
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}

const SettingsMenuButton = ({ firebase, meta }) => {
    if (firebase.isValidatingAuthentication) {
        return <Spinner color="white" colorScheme="white" />
    }
    return (
        firebase.isAuthenticated ? (
            <Authenticated avatarOnly avatarSize="sm" delay={3000} />
        ) : (
                <IconButton
                    className={meta.isDay ? "menu-button" : "menu-button-dark"}
                    borderWidth={0}
                    variant="solid"
                    colorScheme={PRIMARY_COLOR_SCHEME}
                    icon={<BiMenu />}
                />
            )
    )
}

export default SettingsMenu;