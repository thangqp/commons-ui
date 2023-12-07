/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Typography } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import PropTypes from 'prop-types';

const styles = {
    clickable: {
        cursor: 'pointer',
    },
};

const LogoTextOnly = ({ appName, appColor, style, onClick }) => {
    return (
        <Typography
            variant="h4"
            sx={mergeSx(style, onClick && styles.clickable)}
            onClick={onClick}
        >
            <span style={{ fontWeight: 'bold' }}>Grid</span>
            <span style={{ color: appColor }}>{appName}</span>
        </Typography>
    );
};

export default LogoTextOnly;

LogoTextOnly.propTypes = {
    appName: PropTypes.string.isRequired,
    appColor: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onClick: PropTypes.func,
};
