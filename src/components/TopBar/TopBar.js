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
import Brightness1Icon from '@material-ui/icons/Brightness1';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import PropTypes from 'prop-types';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullScreen, { fullScreenSupported } from 'react-request-fullscreen';

import { USER_ID, USER_NAME } from '../../utils/actions';

export const DARK_THEME = 'Dark';
export const LIGHT_THEME = 'Light';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    logo: {
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
        padding: '8px',
        borderRadius: '100%',
        fontWeight: '400',
        textTransform: 'uppercase',
        cursor: 'pointer',
        minHeight: '45px',
        minWidth: '45px',
    },
    arrowIcon: {
        fontSize: '40px',
    },
    userMail: {
        fontSize: '14px',
        display: 'block',
    },
    toggleButton: {
        height: '30px',
        padding: '7px',
        textTransform: 'capitalize',
    },
    borderBottom: {
        borderBottom: '1px solid #ccc',
    },
    sizeLabel: {
        fontSize: '16px',
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
        borderRadius: '15px',
    },
}))(ListItemIcon);

const CustomArrowButton = withStyles((theme) => ({
    root: {
        minWidth: '30px',
        padding: '0',
        '&:focus, &:hover, &:visited, &:active': {
            borderRadius: '15px',
        },
    },
}))(Button);

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
    onDisplayModeClick,
    onDisplayEquipmentClick,
    onAboutClick,
    selectedTheme,
    showSelectedEquipment,
    selectedEquipment,
}) => {
    const classes = useStyles();

    const [anchorElGeneralMenu, setAnchorElGeneralMenu] = React.useState(null);

    const [anchorElAppsMenu, setAnchorElAppsMenu] = React.useState(null);

    const fullScreenRef = useRef(null);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleClickGeneralMenu = (event) => {
        setAnchorElGeneralMenu(event.currentTarget);
    };

    const handleCloseGeneralMenu = () => {
        setAnchorElGeneralMenu(null);
    };
    const handleClickAppsMenu = (event) => {
        setAnchorElAppsMenu(event.currentTarget);
    };

    const handleCloseAppsMenu = () => {
        setAnchorElAppsMenu(null);
    };

    const onParametersClicked = () => {
        handleCloseGeneralMenu();
        if (onParametersClick) {
            onParametersClick();
        }
    };

    function onFullScreenChange(isFullScreen) {
        setIsFullScreen(isFullScreen);
    }

    function requestOrExitFullScreen() {
        setAnchorElGeneralMenu(null);
        fullScreenRef.current.fullScreen();
    }

    const abbrivationFromUserName = () => {
        const tab = user.profile.name.split(' ').map((x) => x.charAt(0));
        return tab[0] + tab[tab.length - 1];
    };

    const onDisplayModeClicked = () => {
        handleCloseGeneralMenu();
        if (onDisplayModeClick) {
            onDisplayModeClick();
        }
    };

    const onDisplayEquipmentClicked = () => {
        handleCloseGeneralMenu();
        if (onDisplayEquipmentClick) {
            onDisplayEquipmentClick();
        }
    };

    const onAboutClicked = () => {
        handleCloseGeneralMenu();
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
                {children}
                <div className={classes.grow} />
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

                <h3>{user !== null ? user.profile.name : ''}</h3>

                {user && (
                    <>
                        <CustomArrowButton
                            aria-controls="general-menu"
                            aria-haspopup="true"
                            onClick={handleClickGeneralMenu}
                        >
                            <span
                                className={classes.name}
                                onClick={handleClickGeneralMenu}
                            >
                                {user !== null ? abbrivationFromUserName() : ''}
                            </span>
                            {anchorElGeneralMenu ? (
                                <ArrowDropUpIcon
                                    className={classes.arrowIcon}
                                />
                            ) : (
                                <ArrowDropDownIcon
                                    className={classes.arrowIcon}
                                />
                            )}
                        </CustomArrowButton>
                        <StyledMenu
                            id="general-menu"
                            anchorEl={anchorElGeneralMenu}
                            keepMounted
                            open={Boolean(anchorElGeneralMenu)}
                            onClose={handleCloseGeneralMenu}
                            autoFocus={false}
                        >
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
                                        <span className={classes.sizeLabel}>
                                            {user.profile.name} <br />
                                            <span className={classes.userMail}>
                                                {user.profile.email}
                                            </span>
                                        </span>
                                    )}
                                </ListItemText>
                            </StyledMenuItem>

                            {/* Display mode */}
                            <StyledMenuItem
                                disabled={true}
                                style={{ opacity: '1' }}
                                className={
                                    !showSelectedEquipment
                                        ? classes.borderBottom
                                        : ''
                                }
                            >
                                <ListItemText>
                                    <Typography
                                        variant="span"
                                        className={classes.sizeLabel}
                                    >
                                        <FormattedMessage
                                            id="top-bar/displayMode"
                                            defaultMessage={'Display mode'}
                                        />
                                    </Typography>
                                </ListItemText>
                                <ToggleButtonGroup
                                    exclusive
                                    value={selectedTheme}
                                    aria-label="text alignment"
                                    style={{
                                        marginLeft: '15px',
                                        pointerEvents: 'auto',
                                    }}
                                    onChange={onDisplayModeClicked}
                                >
                                    <ToggleButton
                                        value={LIGHT_THEME}
                                        aria-label={LIGHT_THEME}
                                        className={classes.toggleButton}
                                        style={{ minWidth: '44px' }}
                                    >
                                        <Brightness1Icon fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton
                                        value={DARK_THEME}
                                        aria-label={DARK_THEME}
                                        className={classes.toggleButton}
                                        style={{ minWidth: '44px' }}
                                    >
                                        <Brightness3Icon fontSize="small" />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </StyledMenuItem>

                            {/* Equipment display */}
                            {showSelectedEquipment && (
                                <StyledMenuItem
                                    className={classes.borderBottom}
                                    style={{ opacity: '1' }}
                                    disabled={true}
                                >
                                    <ListItemText>
                                        <Typography
                                            variant="span"
                                            className={classes.sizeLabel}
                                        >
                                            <FormattedMessage
                                                id="top-bar/equipmentDisplay"
                                                defaultMessage={
                                                    'Equipment display'
                                                }
                                            />
                                        </Typography>
                                    </ListItemText>
                                    <ToggleButtonGroup
                                        exclusive
                                        value={selectedEquipment}
                                        aria-label="text alignment"
                                        onChange={onDisplayEquipmentClicked}
                                        style={{
                                            marginLeft: '15px',
                                            minWidth: '45px',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <ToggleButton
                                            value={USER_ID}
                                            aria-label={USER_ID}
                                            className={classes.toggleButton}
                                        >
                                            <FormattedMessage
                                                id="top-bar/id"
                                                defaultMessage={'Id'}
                                            />
                                        </ToggleButton>
                                        <ToggleButton
                                            value={USER_NAME}
                                            aria-label={USER_NAME}
                                            className={classes.toggleButton}
                                        >
                                            <FormattedMessage
                                                id="top-bar/name"
                                                defaultMessage={'Name'}
                                            />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </StyledMenuItem>
                            )}

                            {/* Settings */}
                            <StyledMenuItem onClick={onParametersClicked}>
                                <CustomListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </CustomListItemIcon>
                                <ListItemText>
                                    <Typography
                                        variant="span"
                                        className={classes.sizeLabel}
                                    >
                                        <FormattedMessage
                                            id="top-bar/settings"
                                            defaultMessage={'Settings'}
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
                                        variant="span"
                                        className={classes.sizeLabel}
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
                                    onClick={requestOrExitFullScreen}
                                >
                                    {isFullScreen ? (
                                        <>
                                            <CustomListItemIcon>
                                                <FullscreenExitIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    variant="span"
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
                                                    variant="span"
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
                                        variant="span"
                                        className={classes.sizeLabel}
                                    >
                                        <FormattedMessage
                                            id="top-bar/logout"
                                            defaultMessage={'Logout'}
                                        />
                                    </Typography>
                                </ListItemText>
                            </StyledMenuItem>
                        </StyledMenu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    onParametersClick: PropTypes.func,
    onDisplayModeClick: PropTypes.func,
    onDisplayEquipmentClick: PropTypes.func,
    onAboutClick: PropTypes.func,
    selectedTheme: PropTypes.string.isRequired,
    showSelectedEquipment: PropTypes.bool.isRequired,
    selectedEquipment: PropTypes.string.isRequired,
};

export default TopBar;
