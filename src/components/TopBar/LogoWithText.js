/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { mergeSx } from '../../utils/styles';
import PropTypes from 'prop-types';

const styles = {
    logo: {
        flexShrink: 0,
        width: 48,
        height: 48,
        marginBottom: '8px',
    },
    title: {
        marginLeft: '18px',
    },
};

const LogoWithText = ({ appLogo, appName, appColor, onClick }) => {
    return (
        <>
            <Box
                sx={mergeSx(styles.logo, onClick && styles.clickable)}
                onClick={onClick}
            >
                {appLogo || <BrokenImage />}
            </Box>
            <Typography
                variant="h4"
                sx={mergeSx(styles.title, onClick && styles.clickable)}
                onClick={onClick}
            >
                <span style={{ fontWeight: 'bold' }}>Grid</span>
                <span style={{ color: appColor }}>{appName}</span>
            </Typography>
        </>
    );
};

export default LogoWithText;

LogoWithText.propTypes = {
    appLogo: PropTypes.element,
    appName: PropTypes.string.isRequired,
    appColor: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
