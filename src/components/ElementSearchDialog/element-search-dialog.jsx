/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { Autocomplete, Dialog, DialogContent, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { Search, SearchOff } from '@mui/icons-material';
import { useIntl } from 'react-intl';

const ElementSearchDialog = (props) => {
    const intl = useIntl();

    const {
        open,
        onClose,
        searchingLabel,
        onSearchTermChange,
        onSelectionChange,
        elementsFound, // [{ label: aLabel, id: anId }, ...]
        renderElement,
        searchTermDisabled,
        searchTermDisableReason,
    } = props;

    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState(
        searchTermDisabled && searchTermDisableReason
            ? { label: searchTermDisableReason }
            : null
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [elementsFound]);

    useEffect(() => {
        if (!searchTermDisabled || !searchTermDisableReason) {
            setValue(null);
        } else {
            setValue({ label: searchTermDisableReason });
        }
    }, [searchTermDisabled, searchTermDisableReason]);

    // to reset the value between the dialog closing and opening
    useEffect(() => {
        setValue((old) => (!open ? null : old));
    }, [open]);

    const handleSearchTermChange = (term) => {
        if (term) {
            setLoading(true);
            onSearchTermChange(term);
            setExpanded(true);
            setValue({ label: term });
        } else {
            setExpanded(false);
            setValue(null);
        }
    };

    const handleClose = useCallback(() => {
        setValue(null);
        setExpanded(false);
        onClose();
    }, [onClose]);

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
                    id="element-search"
                    forcePopupIcon={false}
                    open={expanded}
                    onClose={() => {
                        setExpanded(false);
                    }}
                    fullWidth
                    freeSolo
                    clearOnBlur
                    onInputChange={(_event, value) => {
                        if (!searchTermDisabled) {
                            handleSearchTermChange(value);
                        }
                    }}
                    onChange={(_event, newValue, reason) => {
                        if (reason === 'selectOption') {
                            onSelectionChange(newValue);
                            setValue(newValue);
                        } else {
                            setValue(null);
                        }
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    options={loading ? [] : elementsFound}
                    loading={loading}
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
                    renderInput={(params) => (
                        <TextField
                            autoFocus={true}
                            {...params}
                            label={
                                searchingLabel ||
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
                        />
                    )}
                    value={value}
                    disabled={searchTermDisabled}
                />
            </DialogContent>
        </Dialog>
    );
};

ElementSearchDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    searchingLabel: PropTypes.string,
    onSearchTermChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    elementsFound: PropTypes.array.isRequired,
    renderElement: PropTypes.func.isRequired,
    searchTermDisabled: PropTypes.bool,
    searchTermDisableReason: PropTypes.string,
};

export default ElementSearchDialog;
