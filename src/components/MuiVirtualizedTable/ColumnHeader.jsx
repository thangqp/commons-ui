/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';

import {
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    FilterAltOutlined as FilterAltOutlinedIcon,
} from '@mui/icons-material';

import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { mergeSx } from '../../utils/styles';

const styles = {
    label: {
        fontWeight: 'bold',
        fontSize: '0.875rem', // to mimic TableCellRoot 'binding'
    },
    divFlex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    divNum: {
        flexDirection: 'row-reverse',
        textAlign: 'right',
    },
    sortDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sortButton: {
        fill: 'currentcolor',
    },
    filterButton: {
        stroke: 'currentcolor',
    },
    filterTooLossy: (theme) => ({
        stroke: theme.palette.secondary.main,
    }),
    transparent: {
        opacity: 0,
    },
    hovered: {
        opacity: 0.5,
    },
};

// Shows an arrow pointing to smaller value when sorting is active.
// signedRank of 0 means no sorting, we only show the arrow on hovering of the header,
// in the same direction as it will get if clicked (once).
// signedRank > 0 means sorted by ascending value from lower indices to higher indices
// so lesser values are at top, so the upward arrow
const SortButton = (props) => {
    const sortRank = Math.abs(props.signedRank);
    const visibilityStyle =
        (!props.signedRank || undefined) &&
        (props.headerHovered ? styles.hovered : styles.transparent);
    return (
        <Box sx={styles.sortDiv} onClick={props.onClick}>
            {props.signedRank >= 0 ? (
                <ArrowUpwardIcon sx={visibilityStyle} />
            ) : (
                <ArrowDownwardIcon sx={visibilityStyle} />
            )}
            {sortRank > 1 && !props.hovered && <sub>{sortRank}</sub>}
        </Box>
    );
};

const FilterButton = (props) => {
    const visibilityStyle =
        !props.filterLevel &&
        (props.headerHovered ? styles.hovered : styles.transparent);
    return (
        <FilterAltOutlinedIcon
            onClick={props.onClick}
            sx={mergeSx(
                styles.filterButton,
                props.filterLevel > 1 && styles.filterTooLossy,
                visibilityStyle
            )}
        />
    );
};

export const ColumnHeader = forwardRef((props, ref) => {
    const {
        className,
        label,
        numeric,
        sortSignedRank,
        filterLevel,
        onSortClick,
        onFilterClick,
        onContextMenu,
        style,
    } = props;

    const [hovered, setHovered] = useState();
    const onHover = useCallback((evt) => {
        setHovered(evt.type === 'mouseenter');
    }, []);

    const topmostDiv = useRef();

    const handleFilterClick = useMemo(() => {
        if (!onFilterClick) {
            return undefined;
        }
        return (evt) => {
            onFilterClick(evt, topmostDiv.current);
        };
    }, [onFilterClick]);

    return (
        <Box
            ref={topmostDiv}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            sx={mergeSx(styles.divFlex, numeric && styles.divNum)}
            className={className}
            style={style}
            onContextMenu={onContextMenu}
        >
            {/* we cheat here to get the _variable_ height */}
            <Box ref={ref} sx={styles.label}>
                {label}
            </Box>
            {onSortClick && (
                <SortButton
                    headerHovered={hovered}
                    onClick={onSortClick}
                    signedRank={sortSignedRank}
                />
            )}
            {handleFilterClick && (
                <FilterButton
                    headerHovered={hovered}
                    onClick={handleFilterClick}
                    filterLevel={filterLevel}
                />
            )}
        </Box>
    );
});

export default styled(ColumnHeader)({});
