/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dialog, DialogContent, Divider } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { FormattedMessage, useIntl } from 'react-intl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const MultipleSelectionDialog = ({
    options,
    selectedOptions,
    open,
    getOptionLabel,
    handleClose,
    handleValidate,
    titleId,
}) => {
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    const handleSelectAll = () => {
        if (selectedIds.length !== options.length) {
            setSelectedIds(options);
        } else {
            setSelectedIds([]);
        }
    };
    const handleOptionSelection = (option) => {
        setSelectedIds((oldValues) => {
            if (oldValues.includes(option)) {
                return oldValues.filter((o) => o !== option);
            }

            return [...oldValues, option];
        });
    };

    return (
        <Dialog open={open} fullWidth maxWidth={'lg'}>
            <DialogTitle>
                {titleId}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems={'stretch'}>
                    <Grid item xs={12}>
                        <Divider>
                            <FormControlLabel
                                label={
                                    <FormattedMessage id={'flat_parameters/selectAll'} />
                                }
                                control={
                                    <Checkbox
                                        checked={
                                            selectedIds.length === options.length
                                        }
                                        indeterminate={
                                            selectedIds.length !== options.length &&
                                            selectedIds.length !== 0
                                        }
                                        onChange={handleSelectAll}
                                    />
                                }
                            />
                        </Divider>
                    </Grid>
                    {options.map((option, index) => {
                        const optionId = option?.id ?? option;
                        const label = getOptionLabel(option);
                        return (
                            <>
                                <Grid item xs={4} key={optionId}>
                                    <FormControlLabel
                                        key={optionId}
                                        label={label}
                                        control={
                                            <Checkbox
                                                checked={selectedIds.includes(
                                                    optionId
                                                )}
                                                onChange={() =>
                                                    handleOptionSelection(
                                                        optionId
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </Grid>
                                {/*All rows contain 3 options, and we add divider after each row*/}
                                {(index + 1) % 3 === 0 && (
                                    <Grid item xs={12} key={index}>
                                        <Divider />
                                    </Grid>
                                )}
                            </>
                        );
                    })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>
                    <FormattedMessage id={'flat_parameters/cancel'} />
                </Button>
                <Button onClick={() => handleValidate(selectedIds)}>
                    <FormattedMessage id={'flat_parameters/validate'} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MultipleSelectionDialog;
