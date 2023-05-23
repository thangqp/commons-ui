/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import Label from '@mui/icons-material/Label';
import ReportTreeViewContext from './report-tree-view-context';
import { alpha } from '@mui/system';

const useReportItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&$expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        /* &&.Mui-focused to increase specifity because mui5 has a rule for &.Mui-selected.Mui-focused */
        /* &&$selected to increase specifity because we have a rule for &:hover > $content on root */
        '&&.Mui-focused, &&$selected': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        // same as mui v4 behavior on label text only right after clicking in contrast to after moving away with arrow keys.
        '&$selected $label:hover, &$selected.Mui-focused $label': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity
            ),
        },
        '&.Mui-focused $label, &:hover $label, &$selected $label': {
            backgroundColor: 'transparent',
        },
    },
    group: {
        marginLeft: 10,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelRootHighlighted: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
        backgroundColor: theme.palette.action.selected,
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        marginRight: theme.spacing(2),
    },
}));

const ReportItem = (props) => {
    // using a context because TreeItem uses useMemo on this. See report-viewer.js for the provider
    const { isHighlighted } = useContext(ReportTreeViewContext);

    const highlighted = isHighlighted ? isHighlighted(props.nodeId) : false;

    const classes = useReportItemStyles();
    const { labelText, labelIconColor, ...other } = props;

    return (
        <TreeItem
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            label={
                <div
                    className={
                        highlighted
                            ? classes.labelRootHighlighted
                            : classes.labelRoot
                    }
                >
                    <Label
                        htmlColor={labelIconColor}
                        className={classes.labelIcon}
                    />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                </div>
            }
            {...other}
        />
    );
};

ReportItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

export default ReportItem;
