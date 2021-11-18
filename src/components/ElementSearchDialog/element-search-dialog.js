/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { useIntl } from 'react-intl';

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;

const styles = (theme) => ({
    title: {
        padding: '0px',
    },
    content: {
        display: 'flex',
        alignItems: 'end',
        padding: '20px',
        paddingRight: '0px',
    },
});

const useStyles = makeStyles(styles);

const ElementSearchDialog = (props) => {
    const classes = useStyles();
    const intl = useIntl();

    const {
        open,
        onClose,
        searchingLabel,
        onSearchTermChange,
        onSelectionChange,
        elementsFound, // [{ label: aLabel, id: anId }, ...]
        renderElement,
    } = props;

    const [elements, setElements] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        setElements(elementsFound);
    }, [elementsFound]);

    const handleSearchTermChange = (term) => {
        if (term.length >= TERM_MIN_SIZE_BEFORE_SEARCH) {
            setLoading(true);
            onSearchTermChange(term);
            setExpanded(true);
        } else {
            setElements([]);
            setExpanded(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="dialog-title-search"
            fullWidth={true}
        >
            <DialogTitle className={classes.title} />
            <DialogContent>
                <Autocomplete
                    id="element-search"
                    forcePopupIcon={false}
                    open={expanded}
                    onOpen={() => {
                        setElements([]);
                    }}
                    onClose={() => {
                        setExpanded(false);
                    }}
                    fullWidth
                    onInputChange={(event, value) =>
                        handleSearchTermChange(value)
                    }
                    onChange={(event, newValue) => onSelectionChange(newValue)}
                    getOptionLabel={(option) => option.label}
                    getOptionSelected={(option, value) =>
                        option.id === value.id
                    }
                    options={elements}
                    loading={loading}
                    autoHighlight={true}
                    noOptionsText={intl.formatMessage({
                        id: 'element_search/noResult',
                    })}
                    renderOption={renderElement}
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
                                    <React.Fragment>
                                        <SearchIcon color="disabled" />
                                        {params.InputProps.startAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
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
};

export default ElementSearchDialog;
