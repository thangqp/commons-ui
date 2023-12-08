/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
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
    Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    Apps,
    DnsOutlined,
    ExpandMore,
    Gavel,
    QuestionMark,
    Refresh,
    WidgetsOutlined,
} from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { LogoText } from './GridLogo';

const moduleTypeSort = {
    app: 1,
    server: 10,
    other: 20,
};
function compareModules(c1, c2) {
    //sort by type then by name
    return (
        [moduleTypeSort[c1.type] || 100] - [moduleTypeSort[c2.type] || 100] ||
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
    getAdditionalModules,
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

    const [loadingAdditionalModules, setLoadingAdditionalModules] =
        useState(false);
    const [modules, setModules] = useState(null);
    useEffect(() => {
        if (open) {
            const currentApp = {
                name: `Grid${appName}`,
                type: 'app',
                version: appVersion,
                gitTag: appGitTag,
                license: appLicense,
            };
            if (getAdditionalModules) {
                setLoadingAdditionalModules(true);
                getAdditionalModules((values) => {
                    setLoadingAdditionalModules(false);
                    if (Array.isArray(values)) {
                        setModules([currentApp, ...values]);
                    } else {
                        setModules([currentApp]);
                    }
                });
            } else {
                setModules([currentApp]);
            }
        }
    }, [
        open,
        getAdditionalModules,
        appName,
        appVersion,
        appGitTag,
        appLicense,
    ]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setModules(null);
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
                <FormattedMessage id={'about-dialog/title'} />
            </DialogTitle>
            <DialogContent dividers id="alert-dialog-description">
                <Box>
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
                                            startIcon={
                                                <Refresh fontSize="small" />
                                            }
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
                        <LogoText
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
                </Box>

                {/* TODO found how to scroll only in this box, to keep logo and global version always visible */}
                <Box
                    sx={{
                        '.MuiAccordion-root': {
                            //dunno why the theme has the background as black in dark mode
                            bgcolor: 'unset',
                        },
                        '.MuiAccordionSummary-content > .MuiSvgIcon-root': {
                            marginRight: '0.5rem',
                        },
                    }}
                >
                    <Accordion
                        disableGutters
                        variant="outlined"
                        disabled
                        sx={{ display: 'none' }}
                    >
                        {/* disabled, todo for future update */}
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Gavel fontSize="small" />
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                <FormattedMessage id="about-dialog/license" />
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                {appLicense}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            license app summary text
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        disableGutters
                        variant="outlined"
                        defaultExpanded
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Apps fontSize="small" />
                            <FormattedMessage id="about-dialog/modules-section" />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container sx={{ pl: 2 }} spacing={1}>
                                {loadingAdditionalModules ? (
                                    <Grid
                                        item
                                        xs
                                        display="inline-flex"
                                        justifyContent="center"
                                    >
                                        <CircularProgress color="inherit" />
                                    </Grid>
                                ) : (
                                    (Array.isArray(modules) && (
                                        <>
                                            {[...modules]
                                                .sort(compareModules)
                                                .map((module, idx) => (
                                                    <Module
                                                        key={`module-${idx}`}
                                                        type={module.type}
                                                        name={module.name}
                                                        version={
                                                            module.gitTag ||
                                                            module.version
                                                        }
                                                        license={module.license}
                                                    />
                                                ))}
                                        </>
                                    )) || (
                                        <Typography
                                            color={(theme) =>
                                                theme.palette.error.main
                                            }
                                        >
                                            Error
                                        </Typography>
                                    )
                                )}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
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
    getAdditionalModules: PropTypes.func,
};

const ModuleTypesIcons = {
    app: <WidgetsOutlined fontSize="small" color="primary" />,
    server: <DnsOutlined fontSize="small" color="secondary" />,
    other: <QuestionMark fontSize="small" />,
};

const Module = ({ type, name, version, license }) => {
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
                '.MuiTypography-root': {
                    minWidth: '3em',
                },
            }}
        >
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="baseline"
                spacing={1}
            >
                {ModuleTypesIcons[type] || ModuleTypesIcons['other']}
                <Typography display="inline-block" noWrap>
                    {name || '<?>'}
                </Typography>
                <Typography
                    variant="caption"
                    color={(theme) => theme.palette.text.secondary}
                    display="inline"
                    marginLeft={1}
                    noWrap
                >
                    {version || null}
                </Typography>
            </Stack>
        </Grid>
    );
};
Module.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    version: PropTypes.string,
    license: PropTypes.string,
};
