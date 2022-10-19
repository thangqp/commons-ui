/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export TreeViewFinder from './components/TreeViewFinder';
export TopBar from './components/TopBar';
export SnackbarProvider from './components/SnackbarProvider';
export AuthenticationRouter from './components/AuthenticationRouter';
export MuiVirtualizedTable from './components/MuiVirtualizedTable';
export ReportViewer from './components/ReportViewer';
export ReportViewerDialog from './components/ReportViewerDialog';
export OverflowableText from './components/OverflowableText';
export ElementSearchDialog from './components/ElementSearchDialog';

export {
    EQUIPMENT_TYPE,
    getEquipmentsInfosForSearchBar,
    equipmentStyles,
} from './utils/EquipmentType';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    dispatchUser,
    getPreLoginPath,
} from './utils/AuthService';

export { elementType, getFileIcon } from './utils/ElementType';

export {
    DEFAULT_CELL_PADDING,
    DEFAULT_HEADER_HEIGHT,
    DEFAULT_ROW_HEIGHT,
} from './components/MuiVirtualizedTable/MuiVirtualizedTable';

export {
    DARK_THEME,
    LIGHT_THEME,
    LANG_SYSTEM,
    LANG_ENGLISH,
    LANG_FRENCH,
} from './components/TopBar/TopBar';
export {
    USER,
    setLoggedUser,
    SIGNIN_CALLBACK_ERROR,
    setSignInCallbackError,
    UNAUTHORIZED_USER_INFO,
    setShowAuthenticationRouterLogin,
    SHOW_AUTH_INFO_LOGIN,
} from './utils/actions';
export report_viewer_en from './components/translations/report-viewer-en';
export report_viewer_fr from './components/translations/report-viewer-fr';
export login_en from './components/translations/login-en';
export login_fr from './components/translations/login-fr';
export top_bar_en from './components/translations/top-bar-en';
export top_bar_fr from './components/translations/top-bar-fr';
export table_en from './components/translations/table-en';
export table_fr from './components/translations/table-fr';
export treeview_finder_en from './components/translations/treeview-finder-en';
export treeview_finder_fr from './components/translations/treeview-finder-fr';
export element_search_en from './components/translations/element-search-en';
export element_search_fr from './components/translations/element-search-fr';
export equipment_search_en from './components/translations/equipment-search-en';
export equipment_search_fr from './components/translations/equipment-search-fr';
export card_error_boundary_en from './components/translations/card-error-boundary-en';
export card_error_boundary_fr from './components/translations/card-error-boundary-fr';
export { TagRenderer } from './components/ElementSearchDialog';
export { EquipmentItem } from './components/ElementSearchDialog/equipment-item';
export CardErrorBoundary from './components/CardErrorBoundary';
export { useImportExportParams } from './hooks/useImportExportParams';
