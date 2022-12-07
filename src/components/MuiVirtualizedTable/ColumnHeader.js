/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: 'bold',
        padding: '16px',
    },
    divFlex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    divNum: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    sortDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sortButton: {
        width: '1em',
        height: '2em',
        fill: 'currentcolor',
    },
    filterButton: {
        width: '1em',
        height: '1em',
        fill: 'none',
        stroke: 'currentcolor',
        strokeWidth: '3',
    },
    tr180: {
        transform: 'rotate(180deg)',
    },
    filterTooLossy: {
        fill: theme.palette.secondary.main,
    },
    transparent: {
        opacity: 0,
    },
    hovered: {
        opacity: 0.5,
    },
}));

const SortButton = (props) => {
    const classes = useStyles();
    const sortRank = Math.abs(props.signedRank);
    const visibilityClass =
        !props.signedRank &&
        (props.headerHovered ? classes.hovered : classes.transparent);
    return (
        <>
            <div className={clsx(classes.sortDiv)} onClick={props.onClick}>
                <svg
                    className={clsx(
                        classes.sortButton,
                        props.signedRank >= 0 && classes.tr180,
                        visibilityClass
                    )}
                    viewBox="0 0 24 24"
                >
                    <path d="M 20,12 l -1.41,-1.41 L 13,16.17 V4 h -2 v12.17 l-5.58,-5.59 L4,12 l8,8 8,-8z" />
                </svg>
                {sortRank > 1 && !props.hovered && <sub>{sortRank}</sub>}
            </div>
        </>
    );
};

const FilterButton = (props) => {
    const classes = useStyles();
    const visibilityClass =
        !props.filterLevel &&
        (props.headerHovered ? classes.hovered : classes.transparent);
    return (
        <svg
            className={clsx(
                classes.filterButton,
                props.filterLevel > 1 && classes.filterTooLossy,
                visibilityClass
            )}
            viewBox="0 0 50 55"
            onClick={props.onClick}
        >
            <path d="m 0,0 50,0 -21,21 0,34 -8,-8 0,-26 z" />
        </svg>
    );
};

export const ColumnHeader = ({
    className,
    label,
    numeric,
    sortSignedRank,
    filterLevel,
    onSortClick,
    onFilterClick,
    onContextMenu,
}) => {
    const classes = useStyles();

    const [hovered, setHovered] = React.useState();
    const onHover = React.useCallback((evt) => {
        setHovered(evt.type === 'mouseenter');
    }, []);

    const onFC = React.useMemo(() => {
        if (!onFilterClick) return undefined;
        return (evt, ...others) => {
            onFilterClick(evt, evt.target.parentNode.parentNode);
        };
    }, [onFilterClick]);

    return (
        <>
            <div
                onMouseEnter={onHover}
                onMouseLeave={onHover}
                className={clsx(
                    classes.divFlex,
                    numeric && classes.divNum,
                    className
                )}
                onContextMenu={onContextMenu}
            >
                <div className={clsx(classes.label)}>{label}</div>
                {onSortClick && (
                    <SortButton
                        headerHovered={hovered}
                        onClick={onSortClick}
                        signedRank={sortSignedRank}
                    />
                )}
                {onFC && (
                    <FilterButton
                        headerHovered={hovered}
                        onClick={onFC}
                        filterLevel={filterLevel}
                    />
                )}
            </div>
        </>
    );
};

// export default withStyles(defaultStyles)(ColumnHeader);
