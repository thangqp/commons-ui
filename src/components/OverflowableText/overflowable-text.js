/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const overflowStyle = {
    overflow: {
        display: 'inline-block',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    tooltip: {
        whiteSpace: 'pre',
        width: 'fit-content',
        maxWidth: 'fit-content',
    },
};

export const OverflowableText = styled(
    ({ text, tooltipStyle, tooltipSx, className, children, ...props }) => {
        const element = useRef();

        const [overflowed, setOverflowed] = useState(false);

        const checkOverflow = useCallback(() => {
            if (!element.current) {
                return;
            }
            setOverflowed(
                element.current.scrollWidth > element.current.clientWidth
            );
        }, [setOverflowed, element]);

        useEffect(() => {
            checkOverflow();
        }, [checkOverflow, text]);

        const defaultTooltipSx = !tooltipStyle ? overflowStyle.tooltip : false;
        // the previous tooltipStyle classname API was replacing default, not
        // merging with the defaults, so keep the same behavior with the new tooltipSx API
        const finalTooltipSx = tooltipSx || defaultTooltipSx;
        const tooltipStyleProps = {
            ...(tooltipStyle && { classes: { tooltip: tooltipStyle } }),
            ...(finalTooltipSx && {
                slotProps: { tooltip: { sx: finalTooltipSx } },
            }),
        };

        return (
            <Tooltip
                title={text || ''}
                disableHoverListener={!overflowed}
                {
                    ...tooltipStyleProps /* legacy classes or newer slotProps API */
                }
            >
                <Box
                    {...props}
                    ref={element}
                    children={children || text}
                    className={className}
                    sx={overflowStyle.overflow}
                />
            </Tooltip>
        );
    }
)({});

OverflowableText.propTypes = {
    children: PropTypes.array,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
    ]),
    tooltipStyle: PropTypes.string,
    tooltipSx: PropTypes.object,
    sx: PropTypes.object,
    className: PropTypes.string,
};

export default OverflowableText;
