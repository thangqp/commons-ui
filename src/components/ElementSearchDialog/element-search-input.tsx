import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
} from '@mui/material';
import { HTMLAttributes, ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';

export type RenderElementProps<T> = HTMLAttributes<HTMLLIElement> & {
    element: T;
    inputValue: string;
    onClose?: () => void;
};

export interface ElementSearchInputProps<T>
    extends Omit<
        AutocompleteProps<T, false, false, false>,
        // we already defined them in our custom Autocomplete
        'value' | 'onChange' | 'renderInput' | 'options' | 'renderOption'
    > {
    searchingLabel?: string;
    searchTerm: string;
    onClose?: () => void;
    onSearchTermChange: (searchTerm: string) => void;
    onSelectionChange: (selection: T) => void;
    elementsFound: T[];
    renderElement: (props: RenderElementProps<T>) => ReactNode;
    renderInput: (
        searchTerm: string,
        props: AutocompleteRenderInputParams
    ) => ReactNode;
    searchTermDisabled?: boolean;
    searchTermDisableReason?: string;
    isLoading: boolean;
    loadingText?: string;
}

export const ElementSearchInput = <T,>(props: ElementSearchInputProps<T>) => {
    const {
        elementsFound,
        isLoading,
        onSearchTermChange,
        onSelectionChange,
        renderElement,
        renderInput,
        onClose: handleClose,
        searchTerm,
        loadingText,
        searchTermDisableReason,
        searchTermDisabled,
        searchingLabel,
        open,
        ...rest
    } = props;

    const intl = useIntl();

    const displayedValue = useMemo(() => {
        return searchTermDisabled || searchTermDisableReason
            ? searchTermDisableReason ??
                  intl.formatMessage({
                      id: 'element_search/searchDisabled',
                  })
            : searchTerm ?? '';
    }, [searchTerm, searchTermDisabled, searchTermDisableReason, intl]);

    return (
        <Autocomplete
            {...rest}
            open={open}
            id="element-search"
            forcePopupIcon={false}
            fullWidth
            onInputChange={(_event, value, reason) => {
                if (!searchTermDisabled && (reason !== 'reset' || !value)) {
                    onSearchTermChange(value);
                }
            }}
            onChange={(_event, newValue, reason) => {
                // when calling this method with reason == "selectOption", newValue can't be null or of type "string", since an option has been clicked on
                if (newValue !== null && reason === 'selectOption') {
                    onSelectionChange(newValue);
                }
            }}
            options={isLoading ? [] : elementsFound}
            loading={isLoading}
            loadingText={loadingText}
            autoHighlight={true}
            noOptionsText={intl.formatMessage({
                id: 'element_search/noResult',
            })}
            renderOption={(optionProps, element, { inputValue }) =>
                renderElement({
                    ...optionProps,
                    element,
                    inputValue,
                    onClose: handleClose,
                })
            }
            renderInput={(params: AutocompleteRenderInputParams) =>
                renderInput(displayedValue, params)
            }
            disabled={searchTermDisabled}
        />
    );
};
