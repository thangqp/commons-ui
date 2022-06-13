/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const overflowStyle = (theme) => ({
    overflow: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    tooltip: {
        whiteSpace: 'nowrap',
        width: 'fit-content',
        maxWidth: 'fit-content',
    },
});

const useStyles = makeStyles(overflowStyle);

export const OverflowableText = ({ text, className, children, ...props }) => {
    const element = useRef();
    const classes = useStyles();

    const [overflowed, setOverflowed] = useState(false);

    const checkOverflow = useCallback(() => {
        if (!element.current) return;
        setOverflowed(
            element.current.scrollWidth > element.current.clientWidth
        );
    }, [setOverflowed, element]);

    useEffect(() => {
        checkOverflow();
    }, [checkOverflow]);

    return (
        <Tooltip
            title={text || ''}
            disableHoverListener={!overflowed}
            classes={{ tooltip: classes.tooltip }}
        >
            <div
                {...props}
                ref={element}
                className={clsx(className, classes.overflow)}
            >
                {children || text}
            </div>
        </Tooltip>
    );
};

OverflowableText.propTypes = {
    children: PropTypes.array,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
    ]),
    className: PropTypes.string,
};

export default OverflowableText;
