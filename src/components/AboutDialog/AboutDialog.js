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
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const AboutDialog = ({
    open,
    onClose,
    getGlobalVersion,
    getLogoThemed,
    appVersion,
    appLicense,
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

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

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
                        <CircularProgress />
                    </Fade>
                </Box>
                {startingGlobalVersion !== actualGlobalVersion && (
                    <Collapse in={open}>
                        <Alert severity="warning" variant="outlined">
                            <AlertTitle>
                                <FormattedMessage id="about-dialog/alert-running-old-version-title" />
                            </AlertTitle>
                            <FormattedMessage id="about-dialog/alert-running-old-version-content" />
                        </Alert>
                    </Collapse>
                )}
                {/* TODO
                 * List servers + animation loading
                 */}
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
};
