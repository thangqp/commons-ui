import React from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const CancelButton = ({ onClick, variant, disabled }) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            sx={{ color: 'inherit' }}
        >
            <FormattedMessage id="cancel" />
        </Button>
    );
};

export default CancelButton;
