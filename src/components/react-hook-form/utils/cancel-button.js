import React from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const styles = {
    removeButtonTextColor: (theme) => ({
        color: theme.palette.text.primary,
    }),
};
const CancelButton = ({
    onClick,
    variant,
    disabled,
    withCustomColor = true,
}) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            sx={withCustomColor ? styles.removeButtonTextColor : null}
        >
            <FormattedMessage id="cancel" />
        </Button>
    );
};

export default CancelButton;
