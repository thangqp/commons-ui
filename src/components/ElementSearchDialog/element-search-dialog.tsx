/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode, useCallback, useMemo } from 'react';
import {
    Autocomplete,
    Dialog,
    DialogContent,
    TextField,
    AutocompleteInputChangeReason,
    AutocompleteChangeReason,
} from '@mui/material';
import { Search, SearchOff } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { EquipmentInfos } from '../../index';
import * as React from 'react';

interface ElementSearchDialogProps {
    open: boolean;
    onClose: () => void;
    searchingLabel?: string;
    searchTerm: string;
    onSearchTermChange: (searchTerm: string) => void;
    onSelectionChange: (selection: EquipmentInfos) => void;
    elementsFound: EquipmentInfos[];
    renderElement: (props: any) => ReactNode;
    searchTermDisabled?: boolean;
    searchTermDisableReason?: string;
    isLoading: boolean;
    loadingText?: string;
}

const ElementSearchDialog = (props: ElementSearchDialogProps) => {
    const intl = useIntl();

    const {
        open,
        onClose,
        searchingLabel,
        searchTerm,
        onSearchTermChange,
        onSelectionChange,
        elementsFound,
        renderElement,
        searchTermDisabled,
        searchTermDisableReason,
        isLoading,
        loadingText,
    } = props;

    const displayedValue = useMemo(() => {
        return searchTermDisabled || searchTermDisableReason
            ? searchTermDisableReason
            : searchTerm;
    }, [searchTerm, searchTermDisabled, searchTermDisableReason]);

    const handleClose = useCallback(() => {
        onSearchTermChange('');
        onClose();
    }, [onSearchTermChange, onClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableRestoreFocus={true}
            aria-labelledby="dialog-title-search"
            fullWidth={true}
        >
            <DialogContent>
                <Autocomplete
                    open={isLoading || elementsFound?.length > 0}
                    id="element-search"
                    forcePopupIcon={false}
                    fullWidth
                    freeSolo
                    onInputChange={(
                        _event: React.SyntheticEvent,
                        value: string,
                        reason: AutocompleteInputChangeReason
                    ) => {
                        // if reason is equal to "reset", it means it programmatically changed (by selecting a result)
                        // we don't want to change "searchTerm" when clicking a result
                        if (!searchTermDisabled && reason !== 'reset') {
                            onSearchTermChange(value);
                        }
                    }}
                    onChange={(
                        _event: React.SyntheticEvent,
                        newValue: string | EquipmentInfos | null,
                        reason?: AutocompleteChangeReason
                    ) => {
                        // when calling this method with reason == "selectOption", newValue can't be null or of type "string", since an option has been clicked on
                        if (
                            newValue != null &&
                            typeof newValue !== 'string' &&
                            reason === 'selectOption'
                        ) {
                            onSelectionChange(newValue);
                        }
                    }}
                    getOptionLabel={(option: EquipmentInfos | string) =>
                        typeof option === 'string' ? option : option.label
                    }
                    isOptionEqualToValue={(
                        option: EquipmentInfos | string,
                        value: EquipmentInfos | string
                    ) => {
                        if (
                            typeof option === 'string' ||
                            typeof value === 'string'
                        ) {
                            return option === value;
                        } else {
                            return option.id === value.id;
                        }
                    }}
                    options={isLoading ? [] : elementsFound}
                    loading={isLoading}
                    loadingText={loadingText}
                    autoHighlight={true}
                    noOptionsText={intl.formatMessage({
                        id: 'element_search/noResult',
                    })}
                    renderOption={(
                        optionProps: any,
                        element: EquipmentInfos | string,
                        { inputValue }: { inputValue: string }
                    ) =>
                        renderElement({
                            ...optionProps,
                            element,
                            inputValue,
                            onClose: handleClose,
                        })
                    }
                    renderInput={(params: any) => (
                        <TextField
                            autoFocus={true}
                            {...params}
                            label={
                                searchingLabel ??
                                intl.formatMessage({
                                    id: 'element_search/label',
                                })
                            }
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        {searchTermDisabled ? (
                                            <SearchOff color="disabled" />
                                        ) : (
                                            <Search color="disabled" />
                                        )}
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                            value={displayedValue ?? ''}
                        />
                    )}
                    disabled={searchTermDisabled}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ElementSearchDialog;
