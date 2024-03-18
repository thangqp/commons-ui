import type { FunctionComponent, ReactElement } from 'react';
import type {
    ButtonProps,
    SwitchProps,
    CheckboxProps,
    RadioGroupProps,
    SxProps,
    TextFieldProps,
} from '@mui/material';
import { UseSnackMessageReturn } from './hooks/useSnackMessage';
import { AutocompleteInputProps } from './components/react-hook-form/autocomplete-input';
import { ErrorInputProps } from './components/react-hook-form/error-management/error-input';

/**
 * Section to export generated type declarations of .ts or .tsx files
 */

export { useIntlRef } from './hooks/useIntlRef';
export { RawReadOnlyInput } from './components/react-hook-form/raw-read-only-input';
export {
    DirectoryItemsInputProps,
    DirectoryItemsInput,
} from './components/react-hook-form/directory-items-input';
export {
    DirectoryItemSelectorProps,
    DirectoryItemSelector,
} from './components/DirectoryItemSelector/directory-item-selector';
export { FilterCreationDialog } from './components/filter/filter-creation-dialog';
export { ExpertFilterEditionDialog } from './components/filter/expert/expert-filter-edition-dialog';
export { ExplicitNamingFilterEditionDialog } from './components/filter/explicit-naming/explicit-naming-filter-edition-dialog';
export { CriteriaBasedFilterEditionDialog } from './components/filter/criteria-based/criteria-based-filter-edition-dialog';
export { ElementType, getFileIcon } from './utils/ElementType';
export {
    saveExplicitNamingFilter,
    saveCriteriaBasedFilter,
    saveExpertFilter,
} from './components/filter/filters-utils';
export {
    RangeInput,
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from './utils/rhf-inputs/range-input';
export { InputWithPopupConfirmation } from './utils/rhf-inputs/select-inputs/input-with-popup-confirmation';
export { MuiSelectInput } from './utils/rhf-inputs/select-inputs/mui-select-input';
export {
    CountriesInput,
    PARAM_LANGUAGE,
    getSystemLanguage,
    getComputedLanguage,
} from './utils/rhf-inputs/select-inputs/countries-input';
export { MultipleAutocompleteInput } from './utils/rhf-inputs/autocomplete-inputs/multiple-autocomplete-input';
export { CsvUploader } from './utils/rhf-inputs/ag-grid-table-rhf/csv-uploader/csv-uploader';
export { UniqueNameInput } from './components/commons/unique-name-input';
/**
 * Section to export manual type declarations of .js and .jsx files
 */

export const TopBar: FunctionComponent;

export function logout(
    dispatch: any,
    userManagerInstance: any
): Promise<any | undefined>;

export const DARK_THEME: string, LIGHT_THEME: string;

type Input = string | number;

export function useSnackMessage(): UseSnackMessageReturn;

export const AutocompleteInput: FunctionComponent<AutocompleteInputProps>;

export const ErrorInput: FunctionComponent<ErrorInputProps>;

export const SelectInput: FunctionComponent<SelectInputProps>;

export const MidFormError: FunctionComponent;

export const FieldErrorAlert: FunctionComponent;

type TextFieldWithAdornmentProps = TextFieldProps & {
    // variant already included in TextFieldProps
    value: Input; // we override the default type of TextFieldProps which is unknown
    adornmentPosition: string;
    adornmentText: string;
    handleClearValue?: () => void;
};

interface TextInputProps {
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
