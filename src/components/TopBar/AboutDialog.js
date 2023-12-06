/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Skeleton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Apps,
    DnsOutlined,
    ExpandLess,
    ExpandMore,
    QuestionMark,
    Refresh,
    Sync,
    WidgetsOutlined,
} from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import LogoTextOnly from './LogoTextOnly';
import { LoadingButton } from '@mui/lab';

const ComponentsTypesAvatar = {
    app: <WidgetsOutlined fontSize="small" color="primary" />,
    server: <DnsOutlined fontSize="small" color="secondary" />,
    other: <QuestionMark fontSize="small" />,
};

const typeSort = {
    app: 1,
    server: 10,
    other: 20,
};
function compareAdditionalComponents(c1, c2) {
    //sort by type then by name
    return (
        [typeSort[c1.type] || 100] - [typeSort[c2.type] || 100] ||
        (c1.name || '').localeCompare(c2.name || '')
    );
}

const AboutDialog = ({
    open,
    onClose,
    getGlobalVersion,
    appName,
    appVersion,
    appGitTag,
    appLicense,
    getAdditionalComponents,
}) => {
    const theme = useTheme();
    const [isRefreshing, setRefreshState] = useState(false);
    const [loadingGlobalVersion, setLoadingGlobalVersion] = useState(false);

    /* We want to get the initial version once at first render to detect later a new deploy */
    const [startingGlobalVersion, setStartingGlobalVersion] =
        useState(undefined);
    useEffect(() => {
        if (startingGlobalVersion === undefined && getGlobalVersion) {
            getGlobalVersion((value) => {
                setStartingGlobalVersion(value);
                setActualGlobalVersion(value);
            });
        }
    }, [getGlobalVersion, startingGlobalVersion]);

    const [actualGlobalVersion, setActualGlobalVersion] = useState(null);
    useEffect(() => {
        if (open && getGlobalVersion) {
            setLoadingGlobalVersion(true);
            getGlobalVersion((value) => {
                setLoadingGlobalVersion(false);
                setActualGlobalVersion(value || null);
            });
        }
    }, [open, getGlobalVersion]);

    const [openAdditionalComponents, setOpenAdditionalComponents] =
        useState(true);
    const [loadingAdditionalComponents, setLoadingAdditionalComponents] =
        useState(false);
    const [additionalComponents, setAdditionalComponents] = useState(null);
    useEffect(() => {
        if (open) {
            const currentApp = {
                name: `Grid${appName}`,
                type: 'app',
                version: appVersion,
                gitTag: appGitTag,
                license: appLicense,
            };
            if (getAdditionalComponents) {
                setLoadingAdditionalComponents(true);
                getAdditionalComponents((values) => {
                    setLoadingAdditionalComponents(false);
                    if (Array.isArray(values)) {
                        setAdditionalComponents([currentApp, ...values]);
                    } else {
                        setAdditionalComponents([currentApp]);
                    }
                });
            } else {
                setAdditionalComponents([currentApp]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, getAdditionalComponents]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setAdditionalComponents(null);
        setActualGlobalVersion(null);
    }, [onClose]);

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            fullWidth={true}
            maxWidth="md"
            sx={{
                [theme.breakpoints.up('md')]: {
                    maxHeight: '700px',
                },
            }}
            fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <FormattedMessage id={'about-dialog/title'} />
            </DialogTitle>
            <DialogContent dividers id="alert-dialog-description">
                {startingGlobalVersion !== undefined &&
                    startingGlobalVersion !== null &&
                    actualGlobalVersion !== null &&
                    startingGlobalVersion !== actualGlobalVersion && (
                        <Collapse in={open}>
                            <Alert
                                severity="warning"
                                variant="outlined"
                                action={
                                    <LoadingButton
                                        color="inherit"
                                        size="small"
                                        startIcon={<Refresh fontSize="small" />}
                                        loadingPosition="start"
                                        loading={isRefreshing}
                                        onClick={() => {
                                            setRefreshState(true);
                                            window.location.reload();
                                        }}
                                    >
                                        <FormattedMessage id="refresh" />
                                    </LoadingButton>
                                }
                                sx={{ marginBottom: 1 }}
                            >
                                <FormattedMessage id="about-dialog/alert-running-old-version-msg" />
                            </Alert>
                        </Collapse>
                    )}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LogoTextOnly
                        appName="Suite"
                        appColor={theme.palette.grey['500']}
                    />
                </Box>
                <Box
                    component="dl"
                    sx={{
                        textAlign: 'center',
                        marginTop: 0,
                        'dt, dd': {
                            display: 'inline',
                            margin: 0,
                        },
                        dt: {
                            marginRight: '0.5em',
                            '&:after': {
                                content: '" :"',
                            },
                            '&:before': {
                                content: "'\\A'",
                                whiteSpace: 'pre',
                            },
                            '&:first-child': {
                                '&:before': {
                                    content: "''",
                                },
                            },
                        },
                    }}
                >
                    <dt>
                        <FormattedMessage id="about-dialog/version" />
                    </dt>
                    <dd>
                        {loadingGlobalVersion ? (
                            '…'
                        ) : actualGlobalVersion ? (
                            <b style={{ fontSize: '1.5em' }}>
                                {actualGlobalVersion}
                            </b>
                        ) : (
                            <i>unknown</i>
                        )}
                    </dd>
                    <Fade
                        in={loadingGlobalVersion}
                        style={{ transitionDelay: '500ms' }}
                        unmountOnExit
                    >
                        <CircularProgress size="1rem" />
                    </Fade>
                </Box>
                <Box
                    sx={{
                        '.MuiListItemIcon-root': {
                            minWidth: '2rem',
                        },
                    }}
                >
                    <List dense={true}>
                        <ListItemButton
                            onClick={() =>
                                setOpenAdditionalComponents((prev) => !prev)
                            }
                        >
                            <ListItemIcon>
                                <Apps fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <FormattedMessage id="about-dialog/components-section" />
                            </ListItemText>
                            {openAdditionalComponents ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItemButton>
                        <Collapse
                            in={openAdditionalComponents}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List
                                dense={true}
                                component="div"
                                sx={{
                                    maxHeight: '15em',
                                    overflow: 'auto',
                                    paddingTop: 0,
                                    '.MuiListItemText-root': {
                                        marginTop: 0,
                                        marginBottom: 0,
                                    },
                                }}
                            >
                                {loadingAdditionalComponents ? (
                                    <>
                                        {[...Array(5)].map((e, i) => (
                                            <ListItem
                                                sx={{ pl: 4 }}
                                                key={`loader-${i}`}
                                            >
                                                <ListItemIcon disableGutters>
                                                    <Sync
                                                        fontSize="small"
                                                        titleAccess="Loading..."
                                                    />
                                                </ListItemIcon>
                                                <ListItemText>
                                                    <Skeleton
                                                        variant="rectangular"
                                                        height={15}
                                                    />
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </>
                                ) : (
                                    Array.isArray(additionalComponents) && (
                                        <>
                                            {additionalComponents
                                                .sort(
                                                    compareAdditionalComponents
                                                )
                                                .map((cmpnt, idx) => (
                                                    <ListItem
                                                        disableGutters
                                                        sx={{ pl: 4 }}
                                                        key={`cmpnt-${idx}`}
                                                    >
                                                        <ListItemIcon>
                                                            {ComponentsTypesAvatar[
                                                                cmpnt.type
                                                            ] ||
                                                                ComponentsTypesAvatar[
                                                                    'other'
                                                                ]}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                cmpnt.name ||
                                                                '<?>'
                                                            }
                                                            secondary={
                                                                cmpnt.gitTag ||
                                                                cmpnt.version ||
                                                                null
                                                            }
                                                            primaryTypographyProps={{
                                                                display:
                                                                    'inline-block',
                                                            }}
                                                            secondaryTypographyProps={{
                                                                display:
                                                                    'inline',
                                                                marginLeft: 1,
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                        </>
                                    )
                                )}
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    <FormattedMessage id="close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AboutDialog;

AboutDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    appName: PropTypes.string.isRequired,
    appVersion: PropTypes.string,
    appGitTag: PropTypes.string,
    appLicense: PropTypes.string,
    getGlobalVersion: PropTypes.func,
    getAdditionalComponents: PropTypes.func,
};
