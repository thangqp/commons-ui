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
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppsIcon from '@material-ui/icons/Apps';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import PropTypes from 'prop-types';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullScreen, { fullScreenSupported } from 'react-request-fullscreen';

const useStyles = makeStyles(() => ({
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

    const onLogoClicked = () => {
        handleCloseAppsMenu();
        onLogoClick();
    };

    function onFullScreenChange(isFullScreen) {
        setIsFullScreen(isFullScreen);
    }

    function requestOrExitFullScreen() {
        setAnchorElGeneralMenu(null);
        fullScreenRef.current.fullScreen();
    }

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
                                        href={item.url}
                                        className={classes.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <StyledMenuItem onClick={onLogoClicked}>
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
                    <div>
                        <Button
                            aria-controls="general-menu"
                            aria-haspopup="true"
                            onClick={handleClickGeneralMenu}
                        >
                            <MenuIcon />
                        </Button>

                        <StyledMenu
                            id="general-menu"
                            anchorEl={anchorElGeneralMenu}
                            keepMounted
                            open={Boolean(anchorElGeneralMenu)}
                            onClose={handleCloseGeneralMenu}
                        >
                            <StyledMenuItem onClick={onParametersClicked}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    <FormattedMessage
                                        id="top-bar/settings"
                                        defaultMessage={'Settings'}
                                    />
                                </ListItemText>
                            </StyledMenuItem>
                            {fullScreenSupported() ? (
                                <StyledMenuItem
                                    onClick={requestOrExitFullScreen}
                                >
                                    {isFullScreen ? (
                                        <>
                                            <ListItemIcon>
                                                <FullscreenExitIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>
                                                <FormattedMessage
                                                    id="top-bar/exitFullScreen"
                                                    defaultMessage={
                                                        'Exit full screen mode'
                                                    }
                                                />
                                            </ListItemText>
                                        </>
                                    ) : (
                                        <>
                                            <ListItemIcon>
                                                <FullscreenIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>
                                                <FormattedMessage
                                                    id="top-bar/goFullScreen"
                                                    defaultMessage={
                                                        'Full screen'
                                                    }
                                                />
                                            </ListItemText>
                                        </>
                                    )}
                                </StyledMenuItem>
                            ) : (
                                <></>
                            )}
                            <StyledMenuItem onClick={onLogoutClick}>
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    <FormattedMessage
                                        id="top-bar/logout"
                                        defaultMessage={'Logout'}
                                    />
                                </ListItemText>
                            </StyledMenuItem>
                        </StyledMenu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    onParametersClick: PropTypes.func,
};

export default TopBar;
