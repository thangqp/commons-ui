/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogContent } from '@material-ui/core';
import ReportItem from './report-item';
import LogReport from './log-report';
import Grid from '@material-ui/core/Grid';
import LogTable from './log-table';

const useStyles = makeStyles({
    treeView: {
        height: '100%',
        overflow: 'scroll',
    },
    treeItem: {
        whiteSpace: 'nowrap',
    },
    fullScreenIcon: {
        cursor: 'pointer',
    },
    paperFullWidth: {
        height: '100%',
    },
});

export default function ReportViewer(props) {
    const classes = useStyles();
    const { title, open, onClose, jsonReport } = props;

    const [fullScreen, setFullScreen] = useState(false);

    const [selectedNode, setSelectedNode] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState([]);

    const rootReport = useRef(null);
    const allReports = useRef({});
    const treeView = useRef(null);
    const tableRef = useRef();

    const createReporterItem = useCallback(
        (logReport) => {
            allReports.current[logReport.getId()] = logReport;
            return (
                <ReportItem
                    labelText={logReport.getTitle()}
                    labelIconColor={logReport.getHighestSeverity().color}
                    key={logReport.getId().toString()}
                    className={classes.treeItem}
                    nodeId={logReport.getId().toString()}
                >
                    {logReport
                        .getSubReports()
                        .map((value) => createReporterItem(value))}
                </ReportItem>
            );
        },
        [classes.treeItem]
    );

    useEffect(() => {
        rootReport.current = new LogReport(jsonReport);
        let rootId = rootReport.current.getId().toString();
        treeView.current = createReporterItem(rootReport.current);
        setSelectedNode(rootId);
        setExpandedNodes([rootId]);
    }, [jsonReport, createReporterItem]);

    const showFullScreen = () => {
        setFullScreen(true);
    };

    const hideFullScreen = () => {
        setFullScreen(false);
    };

    // only expand if icon was clicked
    const handleToggleNode = (event, nodeIds) => {
        event.persist();
        let iconClicked = event.target.closest('.MuiTreeItem-iconContainer');
        if (iconClicked) {
            setExpandedNodes(nodeIds);
        }
    };

    // only select if icon wasn't clicked
    const handleSelectNode = (event, nodeId) => {
        event.persist();
        let iconClicked = event.target.closest('.MuiTreeItem-iconContainer');
        if (!iconClicked && selectedNode !== nodeId) {
            setSelectedNode(nodeId);
            tableRef.current.showLogs(allReports.current[nodeId].getAllLogs());
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            fullScreen={fullScreen}
            aria-labelledby="dialog-title-report"
            fullWidth={true}
            maxWidth="lg"
            classes={{
                paperFullWidth: classes.paperFullWidth,
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers={true}>
                {rootReport.current && (
                    <Grid container style={{ height: '100%' }}>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{
                                height: '100%',
                                borderRight: '1px solid rgba(81, 81, 81, 1)',
                            }}
                        >
                            <TreeView
                                className={classes.treeView}
                                defaultCollapseIcon={<ArrowDropDownIcon />}
                                defaultExpandIcon={<ArrowRightIcon />}
                                defaultEndIcon={<div style={{ width: 24 }} />}
                                onNodeToggle={handleToggleNode}
                                onNodeSelect={handleSelectNode}
                                selected={selectedNode}
                                defaultExpanded={[
                                    rootReport.current.getId().toString(),
                                ]}
                                expanded={expandedNodes}
                            >
                                {treeView.current}
                            </TreeView>
                        </Grid>
                        <Grid item xs={12} sm={9} style={{ height: '100%' }}>
                            <LogTable
                                ref={tableRef}
                                initialLogs={rootReport.current.getAllLogs()}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                {fullScreen ? (
                    <FullscreenExitIcon
                        onClick={hideFullScreen}
                        className={classes.fullScreenIcon}
                    />
                ) : (
                    <FullscreenIcon
                        onClick={showFullScreen}
                        className={classes.fullScreenIcon}
                    />
                )}
                <Button onClick={() => onClose()} variant="text">
                    <FormattedMessage id="close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
