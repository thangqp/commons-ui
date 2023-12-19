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
    Grid,
    Stack,
    Tooltip,
    tooltipClasses,
    Typography,
    useMediaQuery,
    useTheme,
    Zoom,
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

function getGlobalVersion(fnPromise, type, setData, setLoader) {
    if (fnPromise) {
        console.debug('Getting', type, 'globale version...');
        return new Promise((resolve, reject) => {
            if (setLoader) {
                setLoader(true);
            }
            resolve();
        })
            .then(() => fnPromise())
            .then(
                (value) => {
                    console.debug(type, 'global version is', value);
                    setData(value ?? null);
                },
                (reason) => {
                    console.debug(
                        type,
                        "global version isn't available",
                        reason
                    );
                    setData(null);
                }
            )
            .finally(() => {
                if (setLoader) {
                    setLoader(false);
                }
            });
    } else {
        console.debug('No getter for global version');
        setData(null);
    }
}

const dialogExitTransitionDurationMs = 195;

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
    globalVersionPromise,
    appName,
    appVersion,
    appGitTag,
    appLicense,
    additionalModulesPromise,
}) => {
    const theme = useTheme();
    const [isRefreshing, setRefreshState] = useState(false);
    const [loadingGlobalVersion, setLoadingGlobalVersion] = useState(false);

    /* We want to get the initial version once at first render to detect later a new deploy */
    const [startingGlobalVersion, setStartingGlobalVersion] =
        useState(undefined);
    useEffect(() => {
        if (startingGlobalVersion === undefined && globalVersionPromise) {
            getGlobalVersion(
                globalVersionPromise,
                'global',
                setStartingGlobalVersion,
                undefined
            );
        }
    }, [globalVersionPromise, startingGlobalVersion]);

    const [actualGlobalVersion, setActualGlobalVersion] = useState(null);
    useEffect(() => {
        if (open && globalVersionPromise) {
            getGlobalVersion(
                globalVersionPromise,
                'actual',
                setActualGlobalVersion,
                setLoadingGlobalVersion
            );
        }
    }, [open, globalVersionPromise]);

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
            (additionalModulesPromise
                ? new Promise((resolve) =>
                      resolve(setLoadingAdditionalModules(true))
                  ).then(() => additionalModulesPromise())
                : Promise.reject('no getter')
            )
                .then(
                    (values) => (Array.isArray(values) ? values : []),
                    (reason) => []
                )
                .then((values) => {
                    setModules([currentApp, ...values]);
                })
                .finally(() => setLoadingAdditionalModules(false));
        }
    }, [
        open,
        additionalModulesPromise,
        appName,
        appVersion,
        appGitTag,
        appLicense,
    ]);

    useEffect(() => {
        if (!open) {
            // we wait the end of the fade animation of the dialog before reset content
            setTimeout(
                (setModules, setActualGlobalVersion) => {
                    setModules(null);
                    setActualGlobalVersion(null);
                },
                dialogExitTransitionDurationMs + 5,
                setModules,
                setActualGlobalVersion
            );
        }
    }, [open]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
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
            transitionDuration={{ exit: dialogExitTransitionDurationMs }}
        >
            <DialogTitle id="alert-dialog-title">
                <FormattedMessage id={'about-dialog/title'} />
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
                                sx={{ marginBottom: 2 }}
                            >
                                <FormattedMessage id="about-dialog/alert-running-old-version-msg" />
                            </Alert>
                        </Collapse>
                    )}
                <Box sx={{ height: '5em' }}>
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
                    <Grid
                        container
                        component="dl"
                        columnSpacing={1}
                        justifyContent="center"
                        alignItems="center"
                    >
                        {!actualGlobalVersion ? (
                            <CircularProgress size="1.2rem" />
                        ) : (
                            <Grid
                                item
                                sx={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                }}
                            >
                                <FormattedMessage
                                    id="about-dialog/version"
                                    sx={{
                                        display: 'inline-block',
                                        lineHeight: '1',
                                        fontSize: '1em',
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        lineHeight: '1',
                                        fontSize: '1.3em',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    &nbsp;{actualGlobalVersion}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
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
                                                        version={module.version}
                                                        gitTag={module.gitTag}
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
    globalVersionPromise: PropTypes.func,
    additionalModulesPromise: PropTypes.func,
};

const styles = {
    icons: {
        flexGrow: 0,
        position: 'relative',
        top: '4px',
        flexShrink: 0,
    },
    version: {
        flexGrow: 0,
        alignSelf: 'flex-end',
        flexShrink: 0,
    },
    tooltip: (theme) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            border: '1px solid #dadde9',
            boxShadow: theme.shadows[1],
        },
    }),
    tooltipDetails: {
        display: 'grid',
        gridTemplateColumns: 'max-content auto',
        margin: 0,
        dt: {
            gridColumnStart: 1,
            '&:after': {
                content: '" :"',
            },
        },
        dd: {
            gridColumnStart: 2,
            paddingLeft: '0.5em',
        },
    },
};

const ModuleTypesIcons = {
    app: <WidgetsOutlined sx={styles.icons} fontSize="small" color="primary" />,
    server: (
        <DnsOutlined sx={styles.icons} fontSize="small" color="secondary" />
    ),
    other: <QuestionMark sx={styles.icons} fontSize="small" />,
};

function insensitiveCaseCompare(str, obj) {
    return str.localeCompare(obj, undefined, {
        sensitivity: 'base',
    });
}
function tooltipTypeLabel(type) {
    if (insensitiveCaseCompare('app', type) === 0) {
        return 'about-dialog/module-tooltip-app';
    } else if (insensitiveCaseCompare('server', type) === 0) {
        return 'about-dialog/module-tooltip-server';
    } else {
        return 'about-dialog/module-tooltip-other';
    }
}

const Module = ({ type, name, version, gitTag, license }) => {
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
            <Tooltip
                TransitionComponent={Zoom}
                enterDelay={2500}
                enterNextDelay={350}
                leaveDelay={200}
                placement="bottom-start"
                arrow
                sx={styles.tooltip}
                title={
                    <>
                        <Typography variant="body1">{name || '<?>'}</Typography>
                        <Box component="dl" sx={styles.tooltipDetails}>
                            <Typography variant="body2" component="dt">
                                <FormattedMessage id="about-dialog/label-type" />
                            </Typography>
                            <Typography variant="body2" component="dd">
                                <FormattedMessage id={tooltipTypeLabel(type)} />
                            </Typography>
                            {version && (
                                <>
                                    <Typography variant="body2" component="dt">
                                        <FormattedMessage id="about-dialog/version" />
                                    </Typography>
                                    <Typography variant="body2" component="dd">
                                        {version}
                                    </Typography>
                                </>
                            )}
                            {gitTag && (
                                <>
                                    <Typography variant="body2" component="dt">
                                        <FormattedMessage id="about-dialog/git-version" />
                                    </Typography>
                                    <Typography variant="body2" component="dd">
                                        {gitTag}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                }
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="baseline"
                    spacing={1}
                >
                    {ModuleTypesIcons[type] || ModuleTypesIcons['other']}
                    <Typography display="inline" noWrap>
                        {name || '<?>'}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={(theme) => theme.palette.text.secondary}
                        display="inline"
                        noWrap
                        sx={styles.version}
                    >
                        {gitTag || version || null}
                    </Typography>
                </Stack>
            </Tooltip>
        </Grid>
    );
};
Module.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    version: PropTypes.string,
    gitTag: PropTypes.string,
    license: PropTypes.string,
};
