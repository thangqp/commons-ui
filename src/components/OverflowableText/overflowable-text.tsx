/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    ReactElement,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Box, BoxProps, SxProps, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { Style } from 'node:util';

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

export interface OverflowableTextProps extends BoxProps {
    text?: ReactElement | string;
    tooltipStyle?: Style;
    tooltipSx?: SxProps;
}

export const OverflowableText = styled(
    ({
        text,
        tooltipStyle,
        tooltipSx,
        className,
        children,
        ...props
    }: OverflowableTextProps) => {
        const element = useRef<HTMLHeadingElement>();

        const [overflowed, setOverflowed] = useState(false);

        const checkOverflow = useCallback(() => {
            if (!element.current) {
                return;
            }
            setOverflowed(
                element.current.scrollWidth > element.current.clientWidth
            );
        }, [setOverflowed, element]);

        useLayoutEffect(() => {
            checkOverflow();
        }, [
            checkOverflow,
            text,
            element.current?.scrollWidth,
            element.current?.clientWidth,
        ]);

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

export default OverflowableText;
