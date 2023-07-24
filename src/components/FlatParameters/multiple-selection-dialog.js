import { Dialog, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { FormattedMessage } from 'react-intl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";

const MultipleSelectionDialog = ({
    options,
    selectedOptions,
    open,
    getOptionLabel,
    handleClose,
    handleValidate,
    titleId,
}) => {
    console.log('selectedOptions : ', selectedOptions)
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    const handleOptionToggle = (option) => {
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
                <Grid container spacing={2}>
                    {options.map((option) => {
                        console.log('selectedIds : ', selectedIds, option)
                        const optionId = option?.id ?? option;
                        const label = getOptionLabel(option);
                        return (
                            <Grid
                                item
                                xs={12}
                                key={optionId}
                            >
                                <FormControlLabel
                                    key={optionId}
                                    label={label}
                                    control={
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                optionId
                                            )}
                                            onChange={() =>
                                                handleOptionToggle(optionId)
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
