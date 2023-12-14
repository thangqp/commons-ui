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
        } else {
            // we wait the end of the fade animation of the dialog before reset content
            setTimeout(
                (setModules, setActualGlobalVersion) => {
                    setModules(null);
                    setActualGlobalVersion(null);
                },
                195 + 5,
                setModules,
                setActualGlobalVersion
            );
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
            transitionDuration={{ exit: 195 }}
        >
            <DialogTitle id="alert-dialog-title">
                <FormattedMessage id={'about-dialog/title'} />
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
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
                    <Grid
                        container
                        component="dl"
                        columnSpacing={1}
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            textAlign: 'center',
                            marginTop: 0,
                            'dt, dd': {
                                margin: 0,
                                height: '2em',
                            },
                            '.MuiGrid-item': {
                                height: '100%',
                            },
                            dt: {
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
                                textAlign: 'right',
                            },
                            dd: {
                                //paddingLeft: '0.5em',
                                textAlign: 'left',
                            },
                        }}
                    >
                        <Grid item component="dt" xs={6}>
                            <FormattedMessage id="about-dialog/version" />
                        </Grid>
                        <Grid
                            item
                            component="dd"
                            xs={6}
                            fontSize={
                                !loadingGlobalVersion &&
                                actualGlobalVersion &&
                                '1.5em'
                            }
                            fontWeight={
                                !loadingGlobalVersion &&
                                actualGlobalVersion &&
                                'bold'
                            }
                            fontStyle={
                                !loadingGlobalVersion &&
                                !actualGlobalVersion &&
                                'italic'
                            }
                        >
                            {loadingGlobalVersion
                                ? '…'
                                : actualGlobalVersion || 'unknown'}
                            <Fade
                                in={loadingGlobalVersion}
                                style={{ transitionDelay: '100ms' }}
                                unmountOnExit
                            >
                                <CircularProgress size="1rem" />
                            </Fade>
                        </Grid>
                    </Grid>
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
    getGlobalVersion: PropTypes.func,
    getAdditionalModules: PropTypes.func,
};

const style = {
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
    app: <WidgetsOutlined sx={style.icons} fontSize="small" color="primary" />,
    server: <DnsOutlined sx={style.icons} fontSize="small" color="secondary" />,
    other: <QuestionMark sx={style.icons} fontSize="small" />,
};

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
                enterDelay={3500}
                enterNextDelay={350}
                leaveDelay={200}
                placement="bottom-start"
                arrow
                sx={style.tooltip}
                title={
                    <>
                        <Typography variant="body1">{name || '<?>'}</Typography>
                        <Box component="dl" sx={style.tooltipDetails}>
                            <Typography variant="body2" component="dt">
                                <FormattedMessage id="about-dialog/label-type" />
                            </Typography>
                            <Typography variant="body2" component="dd">
                                <FormattedMessage
                                    id={`about-dialog/module-tooltip-${
                                        'app'.localeCompare(type, undefined, {
                                            sensitivity: 'base',
                                        }) === 0
                                            ? 'app'
                                            : 'server'.localeCompare(
                                                  type,
                                                  undefined,
                                                  { sensitivity: 'base' }
                                              ) === 0
                                            ? 'server'
                                            : 'other'
                                    }`}
                                />
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
                        sx={style.version}
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
