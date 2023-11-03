import React from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

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
            color={withCustomColor ? 'customButton' : 'primary'}
        >
            <FormattedMessage id="cancel" />
        </Button>
    );
};

export default CancelButton;
