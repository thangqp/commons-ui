import React from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const CancelButton = ({
    onClick,
    variant,
    disabled,
    withCustomColor = false,
}) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            color={withCustomColor ? 'primary' : 'secondary'}
        >
            <FormattedMessage id="cancel" />
        </Button>
    );
};

export default CancelButton;
