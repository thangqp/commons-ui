/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import TopBar from '../../src/components/TopBar';
import SnackbarProvider from '../../src/components/SnackbarProvider';

import {
    createTheme,
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import AuthenticationRouter from '../../src/components/AuthenticationRouter';
import CardErrorBoundary from '../../src/components/CardErrorBoundary';
import {
    DEFAULT_CELL_PADDING,
    EQUIPMENT_TYPE,
    equipmentStyles,
    initializeAuthenticationDev,
    LANG_ENGLISH,
    LANG_FRENCH,
    LANG_SYSTEM,
    LIGHT_THEME,
    logout,
} from '../../src';
import { useMatch } from 'react-router';
import { IntlProvider, useIntl } from 'react-intl';

import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { useSnackMessage } from '../../src/hooks/useSnackMessage';

import {
    element_search_en,
    element_search_fr,
    equipment_search_en,
    equipment_search_fr,
    login_en,
    login_fr,
    report_viewer_en,
    report_viewer_fr,
    table_en,
    table_fr,
    top_bar_en,
    top_bar_fr,
    treeview_finder_en,
    treeview_finder_fr,
    card_error_boundary_en,
    card_error_boundary_fr,
} from '../../src/index';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import PowsyblLogo from '-!@svgr/webpack!../images/powsybl_logo.svg';
import MuiVirtualizedTable from '../../src/components/MuiVirtualizedTable';

import ReportViewerDialog from '../../src/components/ReportViewerDialog';
import TreeViewFinder from '../../src/components/TreeViewFinder';
import TreeViewFinderConfig from './TreeViewFinderConfig';

import {
    fetchInfiniteTestDataList,
    fetchInfiniteTestDataTree,
    testDataList,
    testDataTree,
} from '../data/TreeViewFinder';

import { LOGS_JSON } from '../data/ReportViewer';

import { searchEquipments } from '../data/EquipmentSearchBar';
import { elementType, getFileIcon } from '../../src';
import { Grid } from '@mui/material';
import { EquipmentItem } from '../../src/components/ElementSearchDialog/equipment-item';
import OverflowableText from '../../src/components/OverflowableText';

import { setShowAuthenticationRouterLogin } from '../../src/utils/actions';

const messages = {
    en: {
        ...report_viewer_en,
        ...login_en,
        ...top_bar_en,
        ...table_en,
        ...treeview_finder_en,
        ...element_search_en,
        ...equipment_search_en,
        ...card_error_boundary_en,
    },
    fr: {
        ...report_viewer_fr,
        ...login_fr,
        ...top_bar_fr,
        ...table_fr,
        ...treeview_finder_fr,
        ...element_search_fr,
        ...equipment_search_fr,
        ...card_error_boundary_fr,
    },
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const getMuiTheme = (theme) => {
    if (theme === LIGHT_THEME) {
        return lightTheme;
    } else {
        return darkTheme;
    }
};

const useEquipmentStyles = makeStyles(equipmentStyles);

const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight:
                theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.info.light,
        },
    },
    tableCell: {
        flex: 1,
        padding: DEFAULT_CELL_PADDING + 'px',
    },
    noClick: {
        cursor: 'initial',
    },
    tableCellColor: {
        color: theme.palette.primary.contrastText,
    },
    header: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
    },
    rowBackgroundDark: {
        backgroundColor: theme.palette.info.dark,
    },
    rowBackgroundLight: {
        backgroundColor: theme.palette.info.main,
    },
});

const TreeViewFinderCustomStyles = (theme) => ({
    icon: {
        width: '32px',
        height: '32px',
    },
    labelIcon: {
        backgroundColor: 'green',
        marginRight: theme.spacing(1),
    },
});

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
const CustomTreeViewFinder = withStyles(TreeViewFinderCustomStyles)(
    TreeViewFinder
);

const Crasher = () => {
    const [crash, setCrash] = useState(false);
    if (crash) {
        window.foonotexists.bar();
    }
    return <Button onClick={() => setCrash(true)}>CRASH ME</Button>;
};

function SnackErrorButton() {
    const { snackError } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="error"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackError({
                    messageTxt: 'Snack error message',
                    headerTxt: 'Header',
                });
            }}
        >
            error snack hook
        </Button>
    );
}

function SnackWarningButton() {
    const { snackWarning } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="warning"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackWarning({
                    messageTxt: 'Snack warning message',
                    headerTxt: 'Header',
                });
            }}
        >
            warning snack hook
        </Button>
    );
}

function SnackInfoButton() {
    const { snackInfo } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="info"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackInfo({
                    messageTxt: 'Snack info message',
                    headerTxt: 'Header',
                });
            }}
        >
            info snack hook
        </Button>
    );
}

const validateUser = (user) => {
    // change to false to simulate user unauthorized access
    return new Promise((resolve) =>
        window.setTimeout(() => resolve(true), 500)
    );
};

const AppContent = ({ language, onLanguageClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();
    const equipmentClasses = useEquipmentStyles();
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);
    const [authenticationRouterError, setAuthenticationRouterError] =
        useState(null);
    const [
        showAuthenticationRouterLoginState,
        setShowAuthenticationRouterLoginState,
    ] = useState(false);

    const [theme, setTheme] = useState(LIGHT_THEME);

    const [equipmentLabelling, setEquipmentLabelling] = useState(false);

    const [openReportViewer, setOpenReportViewer] = React.useState(false);
    const [openTreeViewFinderDialog, setOpenTreeViewFinderDialog] =
        React.useState(false);
    const [
        openTreeViewFinderDialogCustomDialog,
        setOpenTreeViewFinderDialogCustomDialog,
    ] = React.useState(false);

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch('/silent-renew-callback')
    );

    // TreeViewFinder data
    const [nodesTree, setNodesTree] = useState(testDataTree);
    const [nodesList, setNodesList] = useState(testDataList);

    const countNodes = (nodesList) => {
        return nodesList
            .map((node) => {
                if (node.children && node.children.length > 0)
                    return 1 + countNodes(node.children);
                else return 1;
            })
            .reduce((a, b) => {
                return a + b;
            }, 0);
    };

    // TreeViewFinder Controlled parameters
    const [dynamicData, setDynamicData] = useState(false);
    const [dataFormat, setDataFormat] = useState('Tree');
    const [multiselect, setMultiselect] = useState(false);
    const [onlyLeaves, setOnlyLeaves] = useState(true);
    const [sortedAlphabetically, setSortedAlphabetically] = useState(false);

    // TreeViewFinder data update callbacks
    const updateInfiniteTestDataTreeCallback = (nodeId) => {
        setNodesTree(fetchInfiniteTestDataTree(nodeId));
    };
    const updateInfiniteTestDataListCallback = (nodeId) => {
        setNodesList(fetchInfiniteTestDataList(nodeId));
    };

    // OverFlowableText
    const [overflowableText, setOverflowableText] = useState('no overflow');

    const onChangeOverflowableText = (event) => {
        setOverflowableText(event.target.value);
    };
    // Equipments search bar
    const [equipmentsFound, setEquipmentsFound] = useState([]);
    const searchMatchingEquipments = (searchTerm) => {
        setEquipmentsFound(searchEquipments(searchTerm, equipmentLabelling));
    };
    const displayEquipment = (equipment) => {
        if (equipment != null) {
            equipment.type === EQUIPMENT_TYPE.SUBSTATION.name
                ? alert(`Equipment ${equipment.label} found !`)
                : alert(
                      `Equipment ${equipment.label} (${equipment.voltageLevelLabel}) found !`
                  );
        }
    };

    const dispatch = (e) => {
        if (e.type === 'USER') {
            setUser(e.user);
        } else if (
            e.type === 'UNAUTHORIZED_USER_INFO' ||
            e.type === 'USER_VALIDATION_ERROR' ||
            e.type === 'LOGOUT_ERROR'
        ) {
            setAuthenticationRouterError({ ...e.authenticationRouterError });
        } else if (e.type === 'SHOW_AUTH_INFO_LOGIN') {
            setShowAuthenticationRouterLoginState(
                e.showAuthenticationRouterLogin
            );
        }
    };

    const handleThemeClick = (theme) => {
        setTheme(theme);
    };

    const handleEquipmentLabellingClick = (labelling) => {
        setEquipmentLabelling(labelling);
    };

    const apps = [
        {
            name: 'App1',
            url: '/app1',
            appColor: 'red',
            hiddenInAppsMenu: false,
        },
        { name: 'App2', url: '/app2' },
        { name: 'App3', url: '/app3', hiddenInAppsMenu: true },
    ];

    const rows = [
        { key1: 'row1_val1', key2: 'row1_val2', key3: 'row1_val3' },
        {
            key1: 'row2_val1',
            key2: 'row2_val2',
            key3: 'row2_val3',
            notClickable: true,
        },
        {
            key1: 'row3_val1',
            key2: 'row3_val2',
            key3: 'row3_val3',
            notClickable: true,
        },
        { key1: 'row4_val1', key2: 'row4_val2', key3: 'row4_val3' },
    ];

    useEffect(() => {
        initializeAuthenticationDev(
            dispatch,
            initialMatchSilentRenewCallbackUrl != null,
            validateUser
        )
            .then((userManager) => {
                setUserManager({
                    instance: userManager,
                    error: null,
                });
                userManager.signinSilent().catch((error) => {
                    console.log(error);
                    dispatch(setShowAuthenticationRouterLogin(true));
                });
            })
            .catch(function (exception) {
                setUserManager({
                    instance: null,
                    error: exception.message,
                });
                dispatch(setShowAuthenticationRouterLogin(true));
                console.debug('error when creating userManager');
            });
        // Note: initialMatchSilentRenewCallbackUrl doesn't change
    }, [initialMatchSilentRenewCallbackUrl]);

    function testIcons() {
        return (
            <Grid container direction={'column'}>
                {Object.keys(elementType).map((type) => (
                    <Grid container item key={type}>
                        <Grid item>{getFileIcon(type)}</Grid>
                        <Grid item>{type}</Grid>
                    </Grid>
                ))}
            </Grid>
        );
    }

    function sortAlphabetically(a, b) {
        return a.name.localeCompare(b.name);
    }

    const handleToggleDisableSearch = useCallback(
        () => setSearchDisabled((oldState) => !oldState),
        []
    );
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getMuiTheme(theme)}>
                <SnackbarProvider hideIconVariant={false}>
                    <CssBaseline />
                    <CardErrorBoundary>
                        <TopBar
                            appName="Demo"
                            appColor="#808080"
                            appLogo={<PowsyblLogo />}
                            onParametersClick={() => console.log('settings')}
                            onLogoutClick={() =>
                                logout(dispatch, userManager.instance)
                            }
                            onLogoClick={() => console.log('logo')}
                            onThemeClick={handleThemeClick}
                            theme={theme}
                            onAboutClick={() => console.log('about')}
                            onEquipmentLabellingClick={
                                handleEquipmentLabellingClick
                            }
                            equipmentLabelling={equipmentLabelling}
                            withElementsSearch={true}
                            searchingLabel={intl.formatMessage({
                                id: 'equipment_search/label',
                            })}
                            onSearchTermChange={searchMatchingEquipments}
                            onSelectionChange={displayEquipment}
                            searchDisabled={searchDisabled}
                            elementsFound={equipmentsFound}
                            renderElement={(props) => (
                                <EquipmentItem
                                    classes={equipmentClasses}
                                    {...props}
                                    key={props.element.key}
                                />
                            )}
                            onLanguageClick={onLanguageClick}
                            language={language}
                            user={user}
                            appsAndUrls={apps}
                        >
                            <Crasher />
                            <div
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                foobar-bazfoobar
                            </div>
                            <div style={{ flexGrow: 1 }} />
                            <div style={{ alignSelf: 'center' }}>baz</div>
                        </TopBar>
                        <CardErrorBoundary>
                            {user !== null ? (
                                <div>
                                    <Box mt={3}>
                                        <Typography
                                            variant="h3"
                                            color="textPrimary"
                                            align="center"
                                        >
                                            Connected
                                        </Typography>
                                    </Box>
                                    <hr />
                                    <Box style={{ height: '200px' }}>
                                        <VirtualizedTable
                                            name="Demo Virtualized Table"
                                            rows={rows}
                                            sortable={true}
                                            onRowClick={(...args) => {
                                                console.log(
                                                    'table onRowclick',
                                                    args
                                                );
                                            }}
                                            onCellClick={(...args) => {
                                                console.log(
                                                    'table onCellclick',
                                                    args
                                                );
                                            }}
                                            columns={[
                                                {
                                                    label: 'header1',
                                                    dataKey: 'key1',
                                                },
                                                {
                                                    label: 'header2',
                                                    dataKey: 'key2',
                                                    clickable: true,
                                                },
                                                {
                                                    label: 'header3 and some text',
                                                    dataKey: 'key3',
                                                },
                                            ]}
                                            enableExportCSV={true}
                                            exportCSVDataKeys={['key2', 'key3']}
                                        />
                                    </Box>
                                    <hr />
                                    {testIcons()}
                                    <hr />

                                    <SnackErrorButton />
                                    <SnackWarningButton />
                                    <SnackInfoButton />
                                    <Button
                                        variant="contained"
                                        style={{ float: 'left', margin: '5px' }}
                                        onClick={() =>
                                            setOpenReportViewer(true)
                                        }
                                    >
                                        Logs
                                    </Button>
                                    <ReportViewerDialog
                                        title={'Logs test'}
                                        open={openReportViewer}
                                        onClose={() =>
                                            setOpenReportViewer(false)
                                        }
                                        jsonReport={LOGS_JSON}
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <TreeViewFinderConfig
                                            dynamicData={dynamicData}
                                            dataFormat={dataFormat}
                                            multiselect={multiselect}
                                            onlyLeaves={onlyLeaves}
                                            sortedAlphabetically={
                                                sortedAlphabetically
                                            }
                                            onDynamicDataChange={(event) =>
                                                setDynamicData(
                                                    event.target.value ===
                                                        'dynamic'
                                                )
                                            }
                                            onDataFormatChange={(event) =>
                                                setDataFormat(
                                                    event.target.value
                                                )
                                            }
                                            onSelectionTypeChange={(event) =>
                                                setMultiselect(
                                                    event.target.value ===
                                                        'multiselect'
                                                )
                                            }
                                            onOnlyLeavesChange={(event) =>
                                                setOnlyLeaves(
                                                    event.target.checked
                                                )
                                            }
                                            onSortedAlphabeticallyChange={(
                                                event
                                            ) =>
                                                setSortedAlphabetically(
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            style={{
                                                float: 'left',
                                                margin: '5px',
                                            }}
                                            onClick={() =>
                                                setOpenTreeViewFinderDialog(
                                                    true
                                                )
                                            }
                                        >
                                            Open TreeViewFinder ...
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                float: 'left',
                                                margin: '5px',
                                            }}
                                            onClick={handleToggleDisableSearch}
                                        >
                                            Toggle search ...
                                        </Button>
                                        <TreeViewFinder
                                            open={openTreeViewFinderDialog}
                                            onClose={(nodes) => {
                                                setOpenTreeViewFinderDialog(
                                                    false
                                                );
                                                console.log(
                                                    'Elements chosen : ',
                                                    nodes
                                                );
                                            }}
                                            data={
                                                dataFormat === 'Tree'
                                                    ? nodesTree
                                                    : nodesList
                                            }
                                            multiselect={multiselect}
                                            onTreeBrowse={
                                                dynamicData
                                                    ? dataFormat === 'Tree'
                                                        ? updateInfiniteTestDataTreeCallback
                                                        : updateInfiniteTestDataListCallback
                                                    : undefined
                                            }
                                            onlyLeaves={onlyLeaves}
                                            sortMethod={
                                                sortedAlphabetically
                                                    ? sortAlphabetically
                                                    : undefined
                                            }
                                            // Customisation props to pass the counter in the title
                                            title={
                                                'Number of nodes : ' +
                                                countNodes(
                                                    dataFormat === 'Tree'
                                                        ? nodesTree
                                                        : nodesList
                                                )
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            style={{
                                                float: 'left',
                                                margin: '5px',
                                            }}
                                            onClick={() =>
                                                setOpenTreeViewFinderDialogCustomDialog(
                                                    true
                                                )
                                            }
                                        >
                                            Open Custom TreeViewFinder ...
                                        </Button>
                                        <CustomTreeViewFinder
                                            open={
                                                openTreeViewFinderDialogCustomDialog
                                            }
                                            onClose={(nodes) => {
                                                setOpenTreeViewFinderDialogCustomDialog(
                                                    false
                                                );
                                                console.log(
                                                    'Elements chosen : ',
                                                    nodes
                                                );
                                            }}
                                            data={
                                                dataFormat === 'Tree'
                                                    ? nodesTree
                                                    : nodesList
                                            }
                                            multiselect={multiselect}
                                            onTreeBrowse={
                                                dynamicData
                                                    ? dataFormat === 'Tree'
                                                        ? updateInfiniteTestDataTreeCallback
                                                        : updateInfiniteTestDataListCallback
                                                    : undefined
                                            }
                                            onlyLeaves={onlyLeaves}
                                            // Customisation props
                                            title={
                                                'Custom Title TreeViewFinder, Number of nodes : ' +
                                                countNodes(
                                                    dataFormat === 'Tree'
                                                        ? nodesTree
                                                        : nodesList
                                                )
                                            }
                                            validationButtonText={
                                                'Move To this location'
                                            }
                                        />
                                    </div>
                                    <div
                                        style={{
                                            margin: '10px 0px 0px 0px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TextField
                                            style={{ marginRight: '10px' }}
                                            label="text"
                                            id="overflowableText-textField"
                                            size={'small'}
                                            defaultValue={
                                                'Set large text here to test'
                                            }
                                            onChange={onChangeOverflowableText}
                                        />
                                        <OverflowableText
                                            text={overflowableText}
                                            style={{
                                                width: '200px',
                                                border: '1px solid black',
                                            }}
                                        />
                                    </div>
                                    <hr />
                                    <Crasher />
                                </div>
                            ) : (
                                <AuthenticationRouter
                                    userManager={userManager}
                                    signInCallbackError={null}
                                    authenticationRouterError={
                                        authenticationRouterError
                                    }
                                    showAuthenticationRouterLogin={
                                        showAuthenticationRouterLoginState
                                    }
                                    dispatch={dispatch}
                                    navigate={navigate}
                                    location={location}
                                />
                            )}
                        </CardErrorBoundary>
                    </CardErrorBoundary>
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

const App = () => {
    const [computedLanguage, setComputedLanguage] = useState(LANG_ENGLISH);
    const [language, setLanguage] = useState(LANG_ENGLISH);

    const handleLanguageClick = (pickedLanguage) => {
        setLanguage(pickedLanguage);
        if (pickedLanguage === LANG_SYSTEM) {
            const sysLanguage = navigator.language.split(/[-_]/)[0];
            setComputedLanguage(
                [LANG_FRENCH, LANG_ENGLISH].includes(sysLanguage)
                    ? sysLanguage
                    : LANG_ENGLISH
            );
        } else {
            setComputedLanguage(pickedLanguage);
        }
    };

    return (
        <BrowserRouter basename={'/'}>
            <IntlProvider
                locale={computedLanguage}
                messages={messages[computedLanguage]}
            >
                <AppContent
                    language={language}
                    onLanguageClick={handleLanguageClick}
                />
            </IntlProvider>
        </BrowserRouter>
    );
};

export default App;
