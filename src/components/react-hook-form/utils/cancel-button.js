import React from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

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

CancelButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    withCustomColor: PropTypes.bool,
};

export default CancelButton;
