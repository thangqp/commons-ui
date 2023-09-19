/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useRef, useState } from 'react';

import { FormattedMessage } from 'react-intl';

import AppBar from '@mui/material/AppBar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { darken } from '@mui/material/styles';
import { styled } from '@mui/system';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppsIcon from '@mui/icons-material/Apps';
import SearchIcon from '@mui/icons-material/Search';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ComputerIcon from '@mui/icons-material/Computer';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import PropTypes from 'prop-types';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullScreen, { fullScreenSupported } from 'react-request-fullscreen';

import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { mergeSx } from '../../utils/styles';

import ElementSearchDialog from '../ElementSearchDialog';

const styles = {
    grow: {
        flexGrow: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    logo: {
        flexShrink: 0,
        width: 48,
        height: 48,
        marginBottom: '8px',
    },
    menuIcon: {
        width: 24,
        height: 24,
    },
    title: {
        marginLeft: '18px',
    },
    clickable: {
        cursor: 'pointer',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    name: (theme) => ({
        backgroundColor: darken(theme.palette.background.paper, 0.1),
        paddingTop: '10px',
        borderRadius: '100%',
        fontWeight: '400',
        textTransform: 'uppercase',
        height: '48px',
        width: '48px',
    }),
    arrowIcon: {
        fontSize: '40px',
    },
    userMail: {
        fontSize: '14px',
        display: 'block',
    },
    borderBottom: {
        borderBottom: '1px solid #ccc',
    },
    borderTop: {
        borderTop: '1px solid #ccc',
    },
    settingsMenu: {
        maxWidth: '385px',
        zIndex: 60,
    },
    sizeLabel: {
        fontSize: '16px',
    },
    showHideMenu: {
        padding: '0',
        borderRadius: '25px',
    },
    toggleButtonGroup: {
        marginLeft: '15px',
        pointerEvents: 'auto',
    },
    toggleButton: {
        height: '30px',
        width: '48px',
        padding: '7px',
        textTransform: 'capitalize',
    },
    languageToggleButton: {
        height: '30px',
        width: '48px',
    },
};

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
))({
    '& .MuiMenu-paper': {
        border: '1px solid #d3d4d5',
    },
});

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
        },
    },
}));

const CustomListItemIcon = styled(ListItemIcon)({
    minWidth: '30px',
    paddingRight: '15px',
    borderRadius: '25px',
});

export const DARK_THEME = 'Dark';
export const LIGHT_THEME = 'Light';
export const LANG_SYSTEM = 'sys';
export const LANG_ENGLISH = 'en';
export const LANG_FRENCH = 'fr';
const EN = 'EN';
const FR = 'FR';

const TopBar = ({
    appName,
    appColor,
    appLogo,
    onParametersClick,
    onLogoutClick,
    onLogoClick,
    user,
    children,
    appsAndUrls,
    onAboutClick,
    onThemeClick,
    theme,
    onEquipmentLabellingClick,
    equipmentLabelling,
    withElementsSearch,
    searchDisabled,
    searchingLabel,
    onSearchTermChange,
    onSelectionChange,
    elementsFound,
    renderElement,
    onLanguageClick,
    language,
    searchTermDisabled,
    searchTermDisableReason,
}) => {
    const [anchorElSettingsMenu, setAnchorElSettingsMenu] =
        React.useState(null);
    const [anchorElAppsMenu, setAnchorElAppsMenu] = React.useState(null);
    const fullScreenRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDialogSearchOpen, setDialogSearchOpen] = useState(false);

    const handleClickElementSearch = () => {
        setDialogSearchOpen(true);
    };

    const handleToggleSettingsMenu = (event) => {
        setAnchorElSettingsMenu(event.currentTarget);
    };

    const handleCloseSettingsMenu = () => {
        setAnchorElSettingsMenu(null);
    };

    const handleClickAppsMenu = (event) => {
        setAnchorElAppsMenu(event.currentTarget);
    };

    const handleCloseAppsMenu = () => {
        setAnchorElAppsMenu(null);
    };

    const onParametersClicked = () => {
        setAnchorElSettingsMenu(null);
        if (onParametersClick) {
            onParametersClick();
        }
    };

    function onFullScreenChange(isFullScreenValue) {
        setAnchorElSettingsMenu(null);
        setIsFullScreen(isFullScreen);
    }

    function requestOrExitFullScreen() {
        setAnchorElSettingsMenu(null);
        fullScreenRef.current.fullScreen();
    }

    const abbreviationFromUserName = (name) => {
        const tab = name.split(' ').map((x) => x.charAt(0));
        if (tab.length === 1) {
            return tab[0];
        } else {
            return tab[0] + tab[tab.length - 1];
        }
    };

    const changeTheme = (event, value) => {
        if (onThemeClick && value !== null) {
            onThemeClick(value);
        }
    };

    const changeEquipmentLabelling = (event, value) => {
        if (onEquipmentLabellingClick && value !== null) {
            onEquipmentLabellingClick(value);
        }
    };

    const changeLanguage = (event, value) => {
        if (onLanguageClick && value !== null) {
            onLanguageClick(value);
        }
    };

    const onAboutClicked = () => {
        setAnchorElSettingsMenu(false);
        if (onAboutClick) {
            onAboutClick();
        }
    };

    useEffect(() => {
        if (user && withElementsSearch && !searchDisabled) {
            const openSearch = (e) => {
                if (
                    e.ctrlKey &&
                    e.shiftKey &&
                    (e.key === 'F' || e.key === 'f')
                ) {
                    e.preventDefault();
                    setDialogSearchOpen(true);
                }
            };
            document.addEventListener('keydown', openSearch);
            return () => document.removeEventListener('keydown', openSearch);
        }
    }, [user, withElementsSearch, searchDisabled]);

    return (
        <AppBar position="static" color="default" sx={styles.appBar}>
            <FullScreen
                ref={fullScreenRef}
                onFullScreenChange={onFullScreenChange}
                onFullScreenError={(e) =>
                    console.debug('full screen error : ' + e.message)
                }
            />
            <Toolbar>
                <Box
                    sx={mergeSx(styles.logo, onLogoClick && styles.clickable)}
                    onClick={onLogoClick}
                >
                    {appLogo}
                </Box>
                <Typography
                    variant="h4"
                    sx={mergeSx(styles.title, onLogoClick && styles.clickable)}
                    onClick={onLogoClick}
                >
                    <span style={{ fontWeight: 'bold' }}>Grid</span>
                    <span style={{ color: appColor }}>{appName}</span>
                </Typography>
                <Box sx={styles.grow}>{children}</Box>
                {user && withElementsSearch && (
                    <React.Fragment>
                        <ElementSearchDialog
                            open={isDialogSearchOpen}
                            onClose={() => setDialogSearchOpen(false)}
                            searchingLabel={searchingLabel}
                            onSearchTermChange={onSearchTermChange}
                            onSelectionChange={(element) => {
                                setDialogSearchOpen(false);
                                onSelectionChange(element);
                            }}
                            elementsFound={elementsFound}
                            renderElement={renderElement}
                            searchTermDisabled={searchTermDisabled}
                            searchTermDisableReason={searchTermDisableReason}
                        />
                        <div>
                            <Button
                                color="inherit"
                                onClick={handleClickElementSearch}
                                disabled={searchDisabled}
                            >
                                <SearchIcon />
                            </Button>
                        </div>
                    </React.Fragment>
                )}
                {user && (
                    <div>
                        <Button
                            aria-controls="apps-menu"
                            aria-haspopup="true"
                            onClick={handleClickAppsMenu}
                            color="inherit"
                        >
                            <AppsIcon />
                        </Button>

                        <StyledMenu
                            id="apps-menu"
                            anchorEl={anchorElAppsMenu}
                            keepMounted
                            open={Boolean(anchorElAppsMenu)}
                            onClose={handleCloseAppsMenu}
                        >
                            {appsAndUrls &&
                                appsAndUrls
                                    .filter((item) => !item.hiddenInAppsMenu)
                                    .map((item) => (
                                        <Box
                                            component="a"
                                            key={item.name}
                                            href={item.url}
                                            sx={styles.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <StyledMenuItem
                                                onClick={handleCloseAppsMenu}
                                            >
                                                <ListItemText>
                                                    <span
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Grid
                                                    </span>
                                                    <span
                                                        style={{
                                                            color:
                                                                item.appColor ===
                                                                undefined
                                                                    ? 'grey'
                                                                    : item.appColor,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </ListItemText>
                                            </StyledMenuItem>
                                        </Box>
                                    ))}
                        </StyledMenu>
                    </div>
                )}
                {user && (
                    <div>
                        {/* Button width abbreviation and arrow icon */}
                        <Button
                            aria-controls="settings-menu"
                            aria-haspopup="true"
                            sx={styles.showHideMenu}
                            onClick={handleToggleSettingsMenu}
                            color="inherit"
                            style={
                                Boolean(anchorElSettingsMenu)
                                    ? { cursor: 'initial' }
                                    : { cursor: 'pointer' }
                            }
                        >
                            <Box component="span" sx={styles.name}>
                                {user !== null
                                    ? abbreviationFromUserName(
                                          user.profile.name
                                      )
                                    : ''}
                            </Box>
                            {anchorElSettingsMenu ? (
                                <ArrowDropUpIcon sx={styles.arrowIcon} />
                            ) : (
                                <ArrowDropDownIcon sx={styles.arrowIcon} />
                            )}
                        </Button>

                        {/* Settings menu */}
                        <Popper
                            sx={styles.settingsMenu}
                            open={Boolean(anchorElSettingsMenu)}
                            anchorEl={anchorElSettingsMenu}
                        >
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={handleCloseSettingsMenu}
                                >
                                    <MenuList id="settings-menu">
                                        {/* user info */}
                                        <StyledMenuItem
                                            sx={styles.borderBottom}
                                            disabled={true}
                                            style={{ opacity: '1' }}
                                        >
                                            <CustomListItemIcon>
                                                <PersonIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText disabled={false}>
                                                {user !== null && (
                                                    <Box
                                                        component="span"
                                                        sx={styles.sizeLabel}
                                                    >
                                                        {user.profile.name}{' '}
                                                        <br />
                                                        <Box
                                                            component="span"
                                                            sx={styles.userMail}
                                                        >
                                                            {user.profile.email}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* Display mode */}
                                        <StyledMenuItem
                                            disabled={true}
                                            style={{
                                                opacity: '1',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <ListItemText>
                                                <Typography
                                                    sx={styles.sizeLabel}
                                                >
                                                    <FormattedMessage
                                                        id="top-bar/displayMode"
                                                        defaultMessage={
                                                            'Display mode'
                                                        }
                                                    />
                                                </Typography>
                                            </ListItemText>
                                            <ToggleButtonGroup
                                                exclusive
                                                value={theme}
                                                size="large"
                                                sx={styles.toggleButtonGroup}
                                                onChange={changeTheme}
                                            >
                                                <ToggleButton
                                                    value={LIGHT_THEME}
                                                    aria-label={LIGHT_THEME}
                                                    sx={styles.toggleButton}
                                                >
                                                    <WbSunnyIcon fontSize="small" />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={DARK_THEME}
                                                    aria-label={DARK_THEME}
                                                    sx={styles.toggleButton}
                                                >
                                                    <Brightness3Icon fontSize="small" />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </StyledMenuItem>

                                        {/*/!* Equipment labelling *!/*/}
                                        {/*If the callback onEquipmentLabellingClick is undefined, equipment labelling component should not be displayed*/}
                                        {onEquipmentLabellingClick && (
                                            <StyledMenuItem
                                                disabled={true}
                                                style={{
                                                    opacity: '1',
                                                    // padding: '0',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    backgroundColor:
                                                        'transparent',
                                                }}
                                            >
                                                <ListItemText>
                                                    <Typography
                                                        sx={styles.sizeLabel}
                                                    >
                                                        <FormattedMessage
                                                            id="top-bar/equipmentLabel"
                                                            defaultMessage={
                                                                'Equipment label'
                                                            }
                                                        />
                                                    </Typography>
                                                </ListItemText>
                                                <ToggleButtonGroup
                                                    exclusive
                                                    value={equipmentLabelling}
                                                    sx={
                                                        styles.toggleButtonGroup
                                                    }
                                                    onChange={
                                                        changeEquipmentLabelling
                                                    }
                                                >
                                                    <ToggleButton
                                                        value={false}
                                                        sx={styles.toggleButton}
                                                    >
                                                        <FormattedMessage
                                                            id="top-bar/id"
                                                            defaultMessage={
                                                                'Id'
                                                            }
                                                        />
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value={true}
                                                        sx={styles.toggleButton}
                                                    >
                                                        <FormattedMessage
                                                            id="top-bar/name"
                                                            defaultMessage={
                                                                'Name'
                                                            }
                                                        />
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </StyledMenuItem>
                                        )}
                                        {/*Languages */}
                                        <StyledMenuItem
                                            disabled={true}
                                            style={{
                                                opacity: '1',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <ListItemText>
                                                <Typography
                                                    sx={styles.sizeLabel}
                                                >
                                                    <FormattedMessage
                                                        id="top-bar/language"
                                                        defaultMessage={
                                                            'Language'
                                                        }
                                                    />
                                                </Typography>
                                            </ListItemText>
                                            <ToggleButtonGroup
                                                exclusive
                                                value={language}
                                                sx={styles.toggleButtonGroup}
                                                onChange={changeLanguage}
                                            >
                                                <ToggleButton
                                                    value={LANG_SYSTEM}
                                                    aria-label={LANG_SYSTEM}
                                                    sx={
                                                        styles.languageToggleButton
                                                    }
                                                >
                                                    <ComputerIcon />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={LANG_ENGLISH}
                                                    aria-label={LANG_ENGLISH}
                                                    sx={
                                                        styles.languageToggleButton
                                                    }
                                                >
                                                    {EN}
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={LANG_FRENCH}
                                                    aria-label={LANG_FRENCH}
                                                    sx={styles.toggleButton}
                                                >
                                                    {FR}
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </StyledMenuItem>

                                        {/* Settings */}
                                        {/*If the callback onParametersClicked is undefined, parameters component should be disabled*/}
                                        <StyledMenuItem
                                            disabled={!onParametersClick}
                                            onClick={onParametersClicked}
                                            sx={styles.borderTop}
                                        >
                                            <CustomListItemIcon>
                                                <SettingsIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    sx={styles.sizeLabel}
                                                >
                                                    <FormattedMessage
                                                        id="top-bar/settings"
                                                        defaultMessage={
                                                            'Settings'
                                                        }
                                                    />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* About */}
                                        <StyledMenuItem
                                            sx={styles.borderBottom}
                                            disabled={true}
                                            style={{ opacity: '1' }}
                                            onClick={onAboutClicked}
                                        >
                                            <CustomListItemIcon>
                                                <HelpOutlineIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    sx={styles.sizeLabel}
                                                >
                                                    <FormattedMessage
                                                        id="top-bar/about"
                                                        defaultMessage={'About'}
                                                    />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* Full screen */}
                                        {fullScreenSupported() && (
                                            <StyledMenuItem
                                                onClick={
                                                    requestOrExitFullScreen
                                                }
                                            >
                                                {isFullScreen ? (
                                                    <>
                                                        <CustomListItemIcon>
                                                            <FullscreenExitIcon fontSize="small" />
                                                        </CustomListItemIcon>
                                                        <ListItemText>
                                                            <Typography
                                                                sx={
                                                                    styles.sizeLabel
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    id="top-bar/exitFullScreen"
                                                                    defaultMessage={
                                                                        'Exit full screen mode'
                                                                    }
                                                                />
                                                            </Typography>
                                                        </ListItemText>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CustomListItemIcon>
                                                            <FullscreenIcon fontSize="small" />
                                                        </CustomListItemIcon>
                                                        <ListItemText>
                                                            <Typography
                                                                sx={
                                                                    styles.sizeLabel
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    id="top-bar/goFullScreen"
                                                                    defaultMessage={
                                                                        'Full screen'
                                                                    }
                                                                />
                                                            </Typography>
                                                        </ListItemText>
                                                    </>
                                                )}
                                            </StyledMenuItem>
                                        )}

                                        {/* Loggout */}
                                        <StyledMenuItem onClick={onLogoutClick}>
                                            <CustomListItemIcon>
                                                <ExitToAppIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    sx={styles.sizeLabel}
                                                >
                                                    <FormattedMessage
                                                        id="top-bar/logout"
                                                        defaultMessage={
                                                            'Logout'
                                                        }
                                                    />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Popper>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    onParametersClick: PropTypes.func,
    onLogoutClick: PropTypes.func,
    onLogoClick: PropTypes.func,
    appName: PropTypes.string,
    appColor: PropTypes.string,
    appLogo: PropTypes.object,
    user: PropTypes.object,
    children: PropTypes.node,
    appsAndUrls: PropTypes.array,
    onThemeClick: PropTypes.func,
    theme: PropTypes.string,
    onAboutClick: PropTypes.func,
    onEquipmentLabellingClick: PropTypes.func,
    equipmentLabelling: PropTypes.bool,
    withElementsSearch: PropTypes.bool,
    searchDisabled: PropTypes.bool,
    searchingLabel: PropTypes.string,
    onSearchTermChange: PropTypes.func,
    onSelectionChange: PropTypes.func,
    elementsFound: PropTypes.array,
    onLanguageClick: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    searchTermDisabled: PropTypes.bool,
    searchTermDisableReason: PropTypes.string,
};

export default TopBar;
