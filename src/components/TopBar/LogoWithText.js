/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Box } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { mergeSx } from '../../utils/styles';
import PropTypes from 'prop-types';
import LogoTextOnly from './LogoTextOnly';

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
    clickable: {
        cursor: 'pointer',
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
            <LogoTextOnly
                appName={appName}
                appColor={appColor}
                onClick={onClick}
                style={styles.title}
            />
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
