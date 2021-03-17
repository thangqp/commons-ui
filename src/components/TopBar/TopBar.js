/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useRef, useState } from 'react';

import { FormattedMessage } from 'react-intl';

import AppBar from '@material-ui/core/AppBar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { darken, withStyles } from '@material-ui/core/styles';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppsIcon from '@material-ui/icons/Apps';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import PersonIcon from '@material-ui/icons/Person';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import PropTypes from 'prop-types';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullScreen, { fullScreenSupported } from 'react-request-fullscreen';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        display: 'flex',
    },
    logo: {
        flexShrink: 0,
        width: 48,
        height: 48,
        cursor: 'pointer',
        marginBottom: 8,
    },
    menuIcon: {
        width: 24,
        height: 24,
    },
    title: {
        marginLeft: 18,
        cursor: 'pointer',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    name: {
        backgroundColor: darken(theme.palette.background.paper, 0.1),
        paddingTop: '10px',
        borderRadius: '100%',
        fontWeight: '400',
        textTransform: 'uppercase',
        height: '48px',
        width: '48px',
    },
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
}));

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
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
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

const CustomListItemIcon = withStyles((theme) => ({
    root: {
        minWidth: '30px',
        paddingRight: '15px',
        borderRadius: '25px',
    },
}))(ListItemIcon);

export const DARK_THEME = 'Dark';
export const LIGHT_THEME = 'Light';

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
}) => {
    const classes = useStyles();
    const anchorRef = React.useRef(null);

    const [anchorElSettingsMenu, setAnchorElSettingsMenu] = React.useState(
        false
    );
    const [anchorElAppsMenu, setAnchorElAppsMenu] = React.useState(null);
    const fullScreenRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const handleToggleSettingsMenu = () => {
        setAnchorElSettingsMenu(true);
        setMenuOpen(true);
    };

    const handleCloseSettingsMenu = () => {
        setAnchorElSettingsMenu(false);
        setMenuOpen(false);
    };
    const handleClickAppsMenu = (event) => {
        setAnchorElAppsMenu(event.currentTarget);
    };

    const handleCloseAppsMenu = () => {
        setAnchorElAppsMenu(null);
    };

    const onParametersClicked = () => {
        setAnchorElSettingsMenu(false);
        if (onParametersClick) {
            onParametersClick();
        }
    };

    function onFullScreenChange(isFullScreen) {
        setAnchorElSettingsMenu(false);
        setIsFullScreen(isFullScreen);
    }

    function requestOrExitFullScreen() {
        setAnchorElSettingsMenu(false);
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

    const onAboutClicked = () => {
        setAnchorElSettingsMenu(false);
        if (onAboutClick) {
            onAboutClick();
        }
    };

    return (
        <AppBar position="static" color="default" className={classes.appBar}>
            <FullScreen
                ref={fullScreenRef}
                onFullScreenChange={onFullScreenChange}
                onFullScreenError={(e) =>
                    console.debug('full screen error : ' + e.message)
                }
            />
            <Toolbar>
                <div className={classes.logo} onClick={onLogoClick}>
                    {appLogo}
                </div>
                <Typography
                    variant="h4"
                    className={classes.title}
                    onClick={onLogoClick}
                >
                    <span style={{ fontWeight: 'bold' }}>Grid</span>
                    <span style={{ color: appColor }}>{appName}</span>
                </Typography>
                <div className={classes.grow}>{children}</div>
                {user && (
                    <div>
                        <Button
                            aria-controls="apps-menu"
                            aria-haspopup="true"
                            onClick={handleClickAppsMenu}
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
                                appsAndUrls.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.url}
                                        className={classes.link}
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
                                    </a>
                                ))}
                        </StyledMenu>
                    </div>
                )}
                {user && (
                    <div>
                        {/* Button width abbreviation and arrow icon */}
                        <Button
                            ref={anchorRef}
                            aria-controls="settings-menu"
                            aria-haspopup="true"
                            className={classes.showHideMenu}
                            onClick={handleToggleSettingsMenu}
                            style={
                                isMenuOpen
                                    ? { cursor: 'initial' }
                                    : { cursor: 'pointer' }
                            }
                        >
                            <span className={classes.name}>
                                {user !== null
                                    ? abbreviationFromUserName(
                                          user.profile.name
                                      )
                                    : ''}
                            </span>
                            {anchorElSettingsMenu ? (
                                <ArrowDropUpIcon
                                    className={classes.arrowIcon}
                                />
                            ) : (
                                <ArrowDropDownIcon
                                    className={classes.arrowIcon}
                                />
                            )}
                        </Button>

                        {/* Settings menu */}
                        <Popper
                            className={classes.settingsMenu}
                            open={anchorElSettingsMenu}
                            anchorEl={anchorRef.current}
                            transition
                        >
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={handleCloseSettingsMenu}
                                >
                                    <MenuList id="settings-menu">
                                        {/* user info */}
                                        <StyledMenuItem
                                            className={classes.borderBottom}
                                            disabled={true}
                                            style={{ opacity: '1' }}
                                        >
                                            <CustomListItemIcon>
                                                <PersonIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText disabled={false}>
                                                {user !== null && (
                                                    <span
                                                        className={
                                                            classes.sizeLabel
                                                        }
                                                    >
                                                        {user.profile.name}{' '}
                                                        <br />
                                                        <span
                                                            className={
                                                                classes.userMail
                                                            }
                                                        >
                                                            {user.profile.email}
                                                        </span>
                                                    </span>
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
                                            }}
                                        >
                                            <ListItemText>
                                                <Typography
                                                    className={
                                                        classes.sizeLabel
                                                    }
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
                                                className={
                                                    classes.toggleButtonGroup
                                                }
                                                onChange={changeTheme}
                                            >
                                                <ToggleButton
                                                    value={LIGHT_THEME}
                                                    aria-label={LIGHT_THEME}
                                                    className={
                                                        classes.toggleButton
                                                    }
                                                >
                                                    <WbSunnyIcon fontSize="small" />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={DARK_THEME}
                                                    aria-label={DARK_THEME}
                                                    className={
                                                        classes.toggleButton
                                                    }
                                                >
                                                    <Brightness3Icon fontSize="small" />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </StyledMenuItem>

                                        {/*/!* Equipment labelling *!/*/}
                                        {/*If the callback onEquipmentLabellingClick is not defined, equipment labelling component isn't displayed*/}
                                        {onEquipmentLabellingClick && (
                                            <StyledMenuItem
                                                disabled={true}
                                                style={{
                                                    opacity: '1',
                                                    // padding: '0',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                }}
                                            >
                                                <ListItemText>
                                                    <Typography
                                                        className={
                                                            classes.sizeLabel
                                                        }
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
                                                    className={
                                                        classes.toggleButtonGroup
                                                    }
                                                    onChange={
                                                        changeEquipmentLabelling
                                                    }
                                                >
                                                    <ToggleButton
                                                        value={false}
                                                        className={
                                                            classes.toggleButton
                                                        }
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
                                                        className={
                                                            classes.toggleButton
                                                        }
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

                                        {/* Settings */}
                                        <StyledMenuItem
                                            onClick={onParametersClicked}
                                            className={classes.borderTop}
                                        >
                                            <CustomListItemIcon>
                                                <SettingsIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    className={
                                                        classes.sizeLabel
                                                    }
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
                                            className={classes.borderBottom}
                                            disabled={true}
                                            style={{ opacity: '1' }}
                                            onClick={onAboutClicked}
                                        >
                                            <CustomListItemIcon>
                                                <HelpOutlineIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    className={
                                                        classes.sizeLabel
                                                    }
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
                                                                className={
                                                                    classes.sizeLabel
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
                                                                className={
                                                                    classes.sizeLabel
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
                                                    className={
                                                        classes.sizeLabel
                                                    }
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
    children: PropTypes.array,
    appsAndUrls: PropTypes.array,
    onThemeClick: PropTypes.func,
    theme: PropTypes.string,
    onAboutClick: PropTypes.func,
    onEquipmentLabellingClick: PropTypes.func,
    equipmentLabelling: PropTypes.bool,
};

export default TopBar;
