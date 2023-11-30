/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Grid,
    Skeleton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Bookmark,
    BrokenImage,
    DnsOutlined,
    Gavel,
    QuestionMark,
    WidgetsOutlined,
} from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const ComponentsTypeIcons = {
    app: <WidgetsOutlined />,
    server: <DnsOutlined />,
    other: <QuestionMark />,
};

const AboutDialog = ({
    open,
    onClose,
    getGlobalVersion,
    getLogoThemed,
    appVersion,
    appLicense,
    getAdditionalComponents,
}) => {
    const theme = useTheme();
    const intl = useIntl();

    //TODO is useCallback in component or in caller?
    const logo = useMemo(() => {
        if (getLogoThemed) {
            return getLogoThemed(theme.palette.mode);
        } else {
            return <BrokenImage />;
        }
    }, [getLogoThemed, theme.palette.mode]);

    const handlerGetGlobalVersion = useCallback(getGlobalVersion, [
        getGlobalVersion,
    ]);
    const [loadingGlobalVersion, setLoadingGlobalVersion] = useState(false);

    /* We want to get the initial version once at first render to detect later a new deploy */
    const [startingGlobalVersion, setStartingGlobalVersion] = useState(null);
    useEffect(() => {
        if (getGlobalVersion) {
            handlerGetGlobalVersion((value) => {
                setLoadingGlobalVersion(false);
                setStartingGlobalVersion(value);
                setActualGlobalVersion(value);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [actualGlobalVersion, setActualGlobalVersion] = useState(null);
    useEffect(() => {
        if (open && getGlobalVersion) {
            setLoadingGlobalVersion(true);
            handlerGetGlobalVersion((value) => {
                setLoadingGlobalVersion(false);
                setActualGlobalVersion(value);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, handlerGetGlobalVersion]);

    const [loadingAdditionalComponents, setLoadingAdditionalComponents] =
        useState(false);
    const [additionalComponents, setAdditionalComponents] = useState(null);
    useEffect(() => {
        if (open && getAdditionalComponents) {
            setLoadingAdditionalComponents(true);
            getAdditionalComponents((values) => {
                setLoadingAdditionalComponents(false);
                setAdditionalComponents(values);
            });
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
            fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {intl.formatMessage({ id: 'about-dialog/title' })}
            </DialogTitle>
            <DialogContent dividers id="alert-dialog-description">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {logo}
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
                                content: '":"',
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
                        dd: {
                            fontStyle: 'italic',
                        },
                    }}
                >
                    {appLicense && (
                        <>
                            <dt>
                                <FormattedMessage id="about-dialog/license" />
                            </dt>
                            <dd>{appLicense}</dd>
                        </>
                    )}
                    <dt>Version</dt>
                    <dd>{appVersion || '?unknown?'}</dd>
                </Box>
                <Box component="p">
                    GridSuite version{' '}
                    <b>{actualGlobalVersion || '?unknown?'}</b>
                    <Fade
                        in={loadingGlobalVersion}
                        style={{ transitionDelay: '500ms' }}
                        unmountOnExit
                    >
                        <CircularProgress size="1rem" />
                    </Fade>
                </Box>
                {actualGlobalVersion !== null &&
                    startingGlobalVersion !== actualGlobalVersion && (
                        <Collapse in={open}>
                            <Alert severity="warning" variant="outlined">
                                <AlertTitle>
                                    <FormattedMessage id="about-dialog/alert-running-old-version-title" />
                                </AlertTitle>
                                <FormattedMessage id="about-dialog/alert-running-old-version-content" />
                            </Alert>
                        </Collapse>
                    )}
                {getAdditionalComponents && (
                    <Box
                        sx={{
                            '.MuiPaper-root': {
                                width: '100%',
                            },
                            '.MuiCard-root': {
                                height: '100%',
                                width: '100%',
                            },
                            '.MuiCardHeader-root': {
                                padding: 1,
                            },
                            '.MuiCardContent-root': {
                                padding: 1,
                                paddingTop: 0,
                            },
                        }}
                    >
                        <Box component="p">
                            <FormattedMessage id="about-dialog/components-version" />
                        </Box>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                            {loadingAdditionalComponents ? (
                                <>
                                    {[...Array(3)].map((e, i) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={`loader-${i}`}
                                        >
                                            <Skeleton
                                                variant="rectangular"
                                                height={80}
                                            />
                                        </Grid>
                                    ))}
                                </>
                            ) : (
                                Array.isArray(additionalComponents) && (
                                    <>
                                        {additionalComponents.map(
                                            (cmpnt, idx) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={`cmpnt-${idx}`}
                                                >
                                                    <Card>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar aria-label="component">
                                                                    {ComponentsTypeIcons[
                                                                        cmpnt
                                                                            .type
                                                                    ] ||
                                                                        ComponentsTypeIcons[
                                                                            'other'
                                                                        ]}
                                                                </Avatar>
                                                            }
                                                            title={
                                                                cmpnt.name ||
                                                                '<?>'
                                                            }
                                                            subheader={
                                                                cmpnt.version ||
                                                                ''
                                                            }
                                                        />
                                                        <CardContent>
                                                            {cmpnt.gitTag && (
                                                                <Tooltip
                                                                    title={intl.formatMessage(
                                                                        {
                                                                            id: 'about-dialog/git-version',
                                                                        }
                                                                    )}
                                                                    arrow
                                                                >
                                                                    <Chip
                                                                        icon={
                                                                            <Bookmark />
                                                                        }
                                                                        variant="filled"
                                                                        size="small"
                                                                        label={
                                                                            cmpnt.gitTag
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                            {cmpnt.license && (
                                                                <Tooltip
                                                                    title={intl.formatMessage(
                                                                        {
                                                                            id: 'about-dialog/license',
                                                                        }
                                                                    )}
                                                                    arrow
                                                                >
                                                                    <Chip
                                                                        icon={
                                                                            <Gavel />
                                                                        }
                                                                        variant="outlined"
                                                                        size="small"
                                                                        label={
                                                                            'License: ' +
                                                                            cmpnt.license
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )
                                        )}
                                    </>
                                )
                            )}
                        </Grid>
                    </Box>
                )}
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
    appVersion: PropTypes.string,
    appLicense: PropTypes.string,
    getGlobalVersion: PropTypes.func,
    getLogoThemed: PropTypes.func,
    getAdditionalComponents: PropTypes.func,
};
