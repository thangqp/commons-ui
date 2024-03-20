/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { FunctionComponent, ReactElement } from 'react';
import type { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';
import type {
    ButtonProps,
    SwitchProps,
    CheckboxProps,
    RadioGroupProps,
    SxProps,
    TextFieldProps,
} from '@mui/material';

/**
 * Section to export generated type declarations
 */

export { default as TreeViewFinder } from './components/TreeViewFinder';
export { default as AboutDialog } from './components/TopBar/AboutDialog';
export { default as SnackbarProvider } from './components/SnackbarProvider';
export { default as AuthenticationRouter } from './components/AuthenticationRouter';
export { default as MuiVirtualizedTable } from './components/MuiVirtualizedTable';
export {
    KeyedColumnsRowIndexer,
    CHANGE_WAYS,
} from './components/MuiVirtualizedTable';
export { default as ReportViewer } from './components/ReportViewer';
export { default as ReportViewerDialog } from './components/ReportViewerDialog';
export { default as ElementSearchDialog } from './components/ElementSearchDialog';
export { default as MultipleSelectionDialog } from './components/MultipleSelectionDialog';

export {
    EQUIPMENT_TYPE,
    getEquipmentsInfosForSearchBar,
    equipmentStyles,
} from './utils/EquipmentType';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    dispatchUser,
    getPreLoginPath,
} from './utils/AuthService';

export { getFileIcon } from './utils/ElementType';

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
export { default as report_viewer_en } from './components/translations/report-viewer-en';
export { default as report_viewer_fr } from './components/translations/report-viewer-fr';
export { default as login_en } from './components/translations/login-en';
export { default as login_fr } from './components/translations/login-fr';
export { default as top_bar_en } from './components/translations/top-bar-en';
export { default as top_bar_fr } from './components/translations/top-bar-fr';
export { default as table_en } from './components/translations/table-en';
export { default as table_fr } from './components/translations/table-fr';
export { default as treeview_finder_en } from './components/translations/treeview-finder-en';
export { default as treeview_finder_fr } from './components/translations/treeview-finder-fr';
export { default as element_search_en } from './components/translations/element-search-en';
export { default as element_search_fr } from './components/translations/element-search-fr';
export { default as equipment_search_en } from './components/translations/equipment-search-en';
export { default as equipment_search_fr } from './components/translations/equipment-search-fr';
export { default as card_error_boundary_en } from './components/translations/card-error-boundary-en';
export { default as card_error_boundary_fr } from './components/translations/card-error-boundary-fr';
export { default as flat_parameters_en } from './components/translations/flat-parameters-en';
export { default as flat_parameters_fr } from './components/translations/flat-parameters-fr';
export { default as multiple_selection_dialog_en } from './components/translations/multiple-selection-dialog-en';
export { default as multiple_selection_dialog_fr } from './components/translations/multiple-selection-dialog-fr';
export { default as common_button_en } from './components/translations/common-button-en';
export { default as common_button_fr } from './components/translations/common-button-fr';
export { default as directory_items_input_en } from './components/translations/directory-items-input-en';
export { default as directory_items_input_fr } from './components/translations/directory-items-input-fr';

export { TagRenderer } from './components/ElementSearchDialog';
export { EquipmentItem } from './components/ElementSearchDialog/equipment-item';
export { useIntlRef } from './hooks/useIntlRef';
export { default as SliderInput } from './components/react-hook-form/slider-input';
export { default as TextFieldWithAdornment } from './components/react-hook-form/utils/text-field-with-adornment';
export {
    genHelperPreviousValue,
    genHelperError,
    identity,
    isFieldRequired,
} from './components/react-hook-form/utils/functions';
export { default as DirectoryItemsInput } from './components/react-hook-form/directory-items-input';
export { default as DirectoryItemSelector } from './components/DirectoryItemSelector/directory-item-selector';
export { RawReadOnlyInput } from './components/react-hook-form/raw-read-only-input';
export { UserManagerMock } from './utils/UserManagerMock';

export {
    ExpandingTextFieldProps,
    ExpandingTextField,
} from './components/react-hook-form/expanding-text-field';
/**
 * Section to export manual type declarations of .js and .jsx files
 */

export const CardErrorBoundary: FunctionComponent;

export const TopBar: FunctionComponent;

export function logout(
    dispatch: any,
    userManagerInstance: any
): Promise<any | undefined>;

interface SnackInputs {
    messageTxt?: string;
    messageId?: string;
    messageValues?: Record<string, string>;
    headerTxt?: string;
    headerId?: string;
    headerValues?: Record<string, string>;
}

interface UseSnackMessageReturn {
    snackError: (snackInputs: SnackInputs) => void;
    snackWarning: (snackInputs: SnackInputs) => void;
    snackInfo: (snackInputs: SnackInputs) => void;
}

export function useSnackMessage(): UseSnackMessageReturn;

type Input = string | number;
type Option = string | { id: string; label: string };

interface AutocompleteInputProps
    extends Omit<
        AutocompleteProps<
            Option,
            boolean | undefined,
            boolean | undefined,
            boolean | undefined
        >,
        // we already defined them in our custom Autocomplete
        'value' | 'onChange' | 'renderInput'
    > {
    name: string;
    options: Option[];
    label?: string;
    outputTransform?: (value: Option) => Option;
    inputTransform?: (value: Option) => Option;
    readOnly?: boolean;
    previousValue?: string;
    allowNewValue?: boolean;
    onChangeCallback?: () => void;
    formProps?: Omit<
        TextFieldProps,
        'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
}

export const AutocompleteInput: FunctionComponent<AutocompleteInputProps>;

interface ErrorInputProps {
    name: string;
    InputField?: FunctionComponent;
}

export const ErrorInput: FunctionComponent<ErrorInputProps>;

export const SelectInput: FunctionComponent<
    Omit<
        AutocompleteInputProps,
        'outputTransform' | 'inputTransform' | 'readOnly' | 'getOptionLabel' // already defined in SelectInput
    >
>;

export const MidFormError: FunctionComponent;

export const FieldErrorAlert: FunctionComponent;

type TextFieldWithAdornmentProps = TextFieldProps & {
    // variant already included in TextFieldProps
    value: Input; // we override the default type of TextFieldProps which is unknown
    adornmentPosition: string;
    adornmentText: string;
    handleClearValue?: () => void;
};

export interface TextInputProps {
    name: string;
    label?: string;
    labelValues?: any; // it's for values from https://formatjs.io/docs/react-intl/components/#formattedmessage
    id?: string;
    adornment?: {
        position: string;
        text: string;
    };
    customAdornment?: ReactElement | null;
    outputTransform?: (value: string) => Input;
    inputTransform?: (value: Input) => string;
    acceptValue?: (value: string) => boolean;
    previousValue?: Input;
    clearable?: boolean;
    formProps?: Omit<
        TextFieldWithAdornmentProps | TextFieldProps,
        'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
}

export const TextInput: FunctionComponent<TextInputProps>;

export const FloatInput: FunctionComponent<
    Omit<
        TextInputProps,
        'outputTransform' | 'inputTransform' | 'acceptValue' // already defined in FloatInput
    >
>;

export const IntegerInput: FunctionComponent<
    Omit<
        TextInputProps,
        'outputTransform' | 'inputTransform' | 'acceptValue' // already defined in IntegerInput
    >
>;

interface RadioInputProps {
    name: string;
    label?: string;
    id?: string;
    options: Array<{
        id: string;
        label: string;
    }>;
    formProps?: Omit<RadioGroupProps, 'value'>;
}

export const RadioInput: FunctionComponent<RadioInputProps>;

interface SwitchInputProps {
    name: string;
    label?: string;
    formProps?: Omit<SwitchProps, 'disabled'>;
}

export const SwitchInput: FunctionComponent<SwitchInputProps>;

interface CheckboxInputProps {
    name: string;
    label?: string;
    formProps?: Omit<CheckboxProps, 'disabled'>;
}

export const CheckboxInput: FunctionComponent<CheckboxInputProps>;

export const SubmitButton: FunctionComponent<ButtonProps>;

type CancelButtonProps = ButtonProps & {
    color?: string;
};

export const CancelButton: FunctionComponent<CancelButtonProps>;

export const FieldLabel: FunctionComponent<{
    label: string;
    optional?: boolean;
    values?: any; // it's for values from https://formatjs.io/docs/react-intl/components/#formattedmessage
}>;

interface Parameters {
    name: string;
    description: string;
    type: string;
    defaultValue: any;
    possibleValues?: string[] | null;
}

interface FlatParametersProps extends Pick<TextFieldProps, 'variant'> {
    paramsAsArray: Parameters[];
    initValues: Record<string, any>;
    onChange: (paramName: string, value: any, isEdit: boolean) => void;
    showSeparator?: boolean;
    selectionWithDialog?: (parameters: Parameters) => boolean;
}

export const FlatParameters: FunctionComponent<FlatParametersProps>;

export function useDebounce(
    debouncedFunction: (...args: any[]) => void,
    debounceDelay: number
): (...args: any[]) => void;

interface OverflowableTextProps {
    sx?: SxProps;
    text?: string | ReactElement;
}

export const OverflowableText: FunctionComponent<OverflowableTextProps>;

export enum elementType {
    DIRECTORY = 'DIRECTORY',
    STUDY = 'STUDY',
    FILTER = 'FILTER',
    MODIFICATION = 'MODIFICATION',
    CONTINGENCY_LIST = 'CONTINGENCY_LIST',
    VOLTAGE_INIT_PARAMETERS = 'VOLTAGE_INIT_PARAMETERS',
    SECURITY_ANALYSIS_PARAMETERS = 'SECURITY_ANALYSIS_PARAMETERS',
    LOADFLOW_PARAMETERS = 'LOADFLOW_PARAMETERS',
    SENSITIVITY_PARAMETERS = 'SENSITIVITY_PARAMETERS',
}
