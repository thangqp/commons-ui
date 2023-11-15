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
export {
    KeyedColumnsRowIndexer,
    CHANGE_WAYS,
} from './components/MuiVirtualizedTable';
export ReportViewer from './components/ReportViewer';
export ReportViewerDialog from './components/ReportViewerDialog';
export OverflowableText from './components/OverflowableText';
export ElementSearchDialog from './components/ElementSearchDialog';
export FlatParameters from './components/FlatParameters';
export MultipleSelectionDialog from './components/MultipleSelectionDialog';

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
    LOGOUT_ERROR,
    USER_VALIDATION_ERROR,
    RESET_AUTHENTICATION_ROUTER_ERROR,
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
export flat_parameters_en from './components/translations/flat-parameters-en';
export flat_parameters_fr from './components/translations/flat-parameters-fr';
export multiple_selection_dialog_en from './components/translations/multiple-selection-dialog-en';
export multiple_selection_dialog_fr from './components/translations/multiple-selection-dialog-fr';
export common_button_en from './components/translations/common-button-en';
export common_button_fr from './components/translations/common-button-fr';

export { TagRenderer } from './components/ElementSearchDialog';
export { EquipmentItem } from './components/ElementSearchDialog/equipment-item';
export CardErrorBoundary from './components/CardErrorBoundary';
export { useIntlRef } from './hooks/useIntlRef';
export { useSnackMessage } from './hooks/useSnackMessage';
export { useDebounce } from './hooks/useDebounce';
export AutocompleteInput from './components/react-hook-form/autocomplete-input';
export TextInput from './components/react-hook-form/text-input';
export RadioInput from './components/react-hook-form/radio-input';
export SliderInput from './components/react-hook-form/slider-input';
export FloatInput from './components/react-hook-form/numbers/float-input';
export IntegerInput from './components/react-hook-form/numbers/integer-input';
export SelectInput from './components/react-hook-form/select-input';
export CheckboxInput from './components/react-hook-form/booleans/checkbox-input';
export SwitchInput from './components/react-hook-form/booleans/switch-input';
export ErrorInput from './components/react-hook-form/error-management/error-input';
export FieldErrorAlert from './components/react-hook-form/error-management/field-error-alert';
export MidFormError from './components/react-hook-form/error-management/mid-form-error';
export TextFieldWithAdornment from './components/react-hook-form/utils/text-field-with-adornment';
export FieldLabel from './components/react-hook-form/utils/field-label';
export SubmitButton from './components/react-hook-form/utils/submit-button';
export CancelButton from './components/react-hook-form/utils/cancel-button';
export {
    genHelperPreviousValue,
    genHelperError,
    identity,
    isFieldRequired,
} from './components/react-hook-form/utils/functions';
