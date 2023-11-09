/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useMemo } from 'react';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const CancelButton = ({ withCustomColor = true, ...buttonProps }) => {
    const colorKey = useMemo(() => {
        if (withCustomColor) {
            return 'customButton';
        } else {
            return buttonProps?.color ?? 'primary';
        }
    }, [withCustomColor, buttonProps?.color]);
    return (
        <Button {...buttonProps} color={colorKey}>
            <FormattedMessage id="cancel" />
        </Button>
    );
};

CancelButton.propTypes = {
    withCustomColor: PropTypes.bool,
    buttonProps: PropTypes.object,
};

export default CancelButton;
