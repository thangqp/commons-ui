/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';

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
import { useRouteMatch } from 'react-router';
import { IntlProvider, useIntl } from 'react-intl';

import { BrowserRouter, useHistory, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

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
} from '../../src/index';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
import { renderEquipmentForSearchBar } from '../../src/utils/EquipmentType';
import { elementType, getFileIcon } from '../../src/utils/ElementType';
import { Grid } from '@mui/material';

const messages = {
    en: {
        ...report_viewer_en,
        ...login_en,
        ...top_bar_en,
        ...table_en,
        ...treeview_finder_en,
        ...element_search_en,
        ...equipment_search_en,
    },
    fr: {
        ...report_viewer_fr,
        ...login_fr,
        ...top_bar_fr,
        ...table_fr,
        ...treeview_finder_fr,
        ...element_search_fr,
        ...equipment_search_fr,
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
            backgroundColor: theme.palette.grey[200],
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
        color: 'blue',
    },
    header: {
        backgroundColor: 'lightblue',
        fontWeight: 'bold',
    },
    rowBackgroundDark: {
        backgroundColor: '#81BEF7',
    },
    rowBackgroundLight: {
        backgroundColor: '#EFEFFB',
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

const MyButton = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    return (
        <Button
            variant="contained"
            color={props.variant}
            style={{ float: 'left', color: '#fff', margin: '5px' }}
            onClick={() => {
                enqueueSnackbar(props.message, { variant: props.variant });
            }}
        >
            {props.variant}
        </Button>
    );
};

const AppContent = ({ language, onLanguageClick }) => {
    const history = useHistory();
    const location = useLocation();
    const intl = useIntl();
    const equipmentClasses = useEquipmentStyles();

    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);

    const [theme, setTheme] = useState(LIGHT_THEME);

    const [equipmentLabelling, setEquipmentLabelling] = useState(false);

    const [openReportViewer, setOpenReportViewer] = React.useState(false);
    const [openTreeViewFinderDialog, setOpenTreeViewFinderDialog] =
        React.useState(false);
    const [
        openTreeViewFinderDialogCustomDialog,
        setOpenTreeViewFinderDialogCustomDialog,
    ] = React.useState(false);

    // Can't use lazy initializer because useRouteMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useRouteMatch({
            path: '/silent-renew-callback',
            exact: true,
        })
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

    // TreeViewFinder data update callbacks
    const updateInfiniteTestDataTreeCallback = (nodeId) => {
        setNodesTree(fetchInfiniteTestDataTree(nodeId));
    };
    const updateInfiniteTestDataListCallback = (nodeId) => {
        setNodesList(fetchInfiniteTestDataList(nodeId));
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

    const buttons = [
        {
            variant: 'success',
            message: 'Successfully done the operation.',
            id: 'button1',
        },
        { variant: 'error', message: 'Something went wrong.', id: 'button2' },
    ];

    const rows = [
        { key1: 'row1_val1', key2: 'row1_val2', key3: 'row1_val3' },
        { key1: 'row2_val1', key2: 'row2_val2', key3: 'row2_val3' },
        { key1: 'row3_val1', key2: 'row3_val2', key3: 'row3_val3' },
        { key1: 'row4_val1', key2: 'row4_val2', key3: 'row4_val3' },
    ];

    useEffect(() => {
        initializeAuthenticationDev(
            dispatch,
            initialMatchSilentRenewCallbackUrl != null
        )
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
                userManager.signinSilent();
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
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

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getMuiTheme(theme)}>
                <SnackbarProvider hideIconVariant={false}>
                    <CssBaseline />
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
                        elementsFound={equipmentsFound}
                        renderElement={renderEquipmentForSearchBar(
                            equipmentClasses,
                            intl
                        )}
                        onLanguageClick={onLanguageClick}
                        language={language}
                        user={user}
                        appsAndUrls={apps}
                    >
                        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                            foobar-bazfoobar
                        </div>
                        <div style={{ flexGrow: 1 }} />
                        <div>baz</div>
                    </TopBar>
                    {user !== null ? (
                        <div>
                            <Box mt={20}>
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
                                    columns={[
                                        {
                                            label: 'header1',
                                            dataKey: 'key1',
                                        },
                                        {
                                            label: 'header2',
                                            dataKey: 'key2',
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

                            {buttons.map((button) => (
                                <MyButton {...button} key={button.id} />
                            ))}
                            <Button
                                variant="contained"
                                style={{ float: 'left', margin: '5px' }}
                                onClick={() => setOpenReportViewer(true)}
                            >
                                Logs
                            </Button>
                            <ReportViewerDialog
                                title={'Logs test'}
                                open={openReportViewer}
                                onClose={() => setOpenReportViewer(false)}
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
                                    onDynamicDataChange={(event) =>
                                        setDynamicData(
                                            event.target.value === 'dynamic'
                                        )
                                    }
                                    onDataFormatChange={(event) =>
                                        setDataFormat(event.target.value)
                                    }
                                    onSelectionTypeChange={(event) =>
                                        setMultiselect(
                                            event.target.value === 'multiselect'
                                        )
                                    }
                                    onOnlyLeavesChange={(event) =>
                                        setOnlyLeaves(event.target.checked)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    style={{ float: 'left', margin: '5px' }}
                                    onClick={() =>
                                        setOpenTreeViewFinderDialog(true)
                                    }
                                >
                                    Open TreeViewFinder ...
                                </Button>
                                <TreeViewFinder
                                    open={openTreeViewFinderDialog}
                                    onClose={(nodes) => {
                                        setOpenTreeViewFinderDialog(false);
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
                                    style={{ float: 'left', margin: '5px' }}
                                    onClick={() =>
                                        setOpenTreeViewFinderDialogCustomDialog(
                                            true
                                        )
                                    }
                                >
                                    Open Custom TreeViewFinder ...
                                </Button>
                                <CustomTreeViewFinder
                                    open={openTreeViewFinderDialogCustomDialog}
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
                        </div>
                    ) : (
                        <AuthenticationRouter
                            userManager={userManager}
                            signInCallbackError={null}
                            dispatch={dispatch}
                            history={history}
                            location={location}
                        />
                    )}
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
