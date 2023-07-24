import { Dialog, DialogContent } from '@mui/material';
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
    console.log('selectedOptions : ', selectedOptions);
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
        <Dialog open={open} fullWidth>
            <DialogTitle>
                <FormattedMessage id={titleId} />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems={'stretch'}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            label={
                                <FormattedMessage id={'flat_parameters/all'} />
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
                    </Grid>
                    {options.map((option) => {
                        console.log('selectedIds : ', selectedIds, option);
                        const optionId = option?.id ?? option;
                        const label = getOptionLabel(option);
                        return (
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
                                                handleOptionSelection(optionId)
                                            }
                                        />
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>Cancel</Button>
                <Button onClick={() => handleValidate(selectedIds)}>
                    Validate
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MultipleSelectionDialog;
