/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CheckIcon from '@material-ui/icons/Check';

const defaultStyles = {
    dialogPaper: {
        minWidth: '30%',
    },
    labelRoot: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    labelIcon: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',

        marginRight: '4px',
    },
    icon: {},
};

/**
 * TreeViewFinder documentation :
 * Component to choose elements in a flat list or a Tree data structure
 * It is flexible and allow controlled props to let Parent component manage
 * data.
 *
 * *= mandatory
 *
 * props :
 * - classes: CSS classes, please use withStyles API from MaterialUI
 * - title: Title of the Dialog
 * - open*: dialog state boolean handler
 * - data*: data to feed the component.
 *         Must respect this format:
 *         [{id*: String, parentId*: String, name*: String (, children: [], icon: JSX)}, ...]
 *
 * - selected_init: selected items at initialization (default: [])
 * - expanded_init: ids of the expanded items at initialization, parents will be expanded too (default: [])
 * - onClose: onClose callback to call when closing dialog
 * - onDataUpdate: callback to update data prop when navigating into Tree
 * - validationButtonText: Customized Validation Button text (default: Add N Elements)
 * - onlyLeaves: Allow/Forbid selection only on leaves (default: true)
 * - multiSelect: Allow/Forbid multiselection on Tree (default: false)
 */
const TreeViewFinder = (props) => {
    const intl = useIntl();
    const {
        classes,
        title,
        open,
        data,
        selected_init,
        expanded_init,
        onClose,
        onDataUpdate,
        validationButtonText,
        onlyLeaves,
        multiSelect,
    } = props;

    const [expanded, setExpanded] = useState(
        expanded_init ? expanded_init : []
    );
    const expandedRef = useRef(null);
    expandedRef.current = expanded;

    const [selectedNodes, setSelectedNodes] = useState(
        selected_init ? selected_init : []
    );

    const dataRef = useRef(null);
    dataRef.current = data;

    /* run onDataUpdate at start */
    useEffect(() => {
        if (
            dataRef.current &&
            Array.isArray(dataRef.current) &&
            dataRef.current.length === 0
        )
            onDataUpdate(null);
    }, [onDataUpdate]);

    useEffect(() => {
        setSelectedNodes(selected_init ? selected_init : []);
    }, [selected_init]);

    /* Utilities */
    function isLeaf(node) {
        return onlyLeaves ? !node.children || node.children.length === 0 : true; // otherwise everything is selectable
    }

    /* find a node in data struct by nodeId */
    const recursiveFind = useCallback((node, nodeId) => {
        let res = null;
        if (Array.isArray(node)) {
            node.every((c) => {
                if (c.id === nodeId) res = c;
                else res = recursiveFind(c, nodeId);
                if (res) return false;
                else return true;
            });
        } else if (node.children && node.children.length > 0) {
            node.children.every((c) => {
                if (c.id === nodeId) res = c;
                else res = recursiveFind(c, nodeId);
                if (res) return false;
                else return true;
            });
        }
        return res;
    }, []);

    /* insure parent nodes of a given node are all in expanded state */
    const expandParents = useCallback(
        (expanded_init) => {
            if (expanded_init) {
                let resExpanded = [];
                expanded_init.forEach((nodeId) => {
                    let foundNode = recursiveFind(dataRef.current, nodeId);

                    if (foundNode) resExpanded.unshift(foundNode.id);

                    while (foundNode && foundNode.parentId != null) {
                        foundNode = recursiveFind(
                            dataRef.current,
                            foundNode.parentId
                        );
                        if (foundNode) {
                            resExpanded.unshift(foundNode.id);
                        }
                    }
                });
                setExpanded(resExpanded);
            }
        },
        [dataRef, recursiveFind]
    );

    useEffect(() => {
        expandParents(expanded_init);
    }, [expanded_init, expandParents]);

    /* Manage treeItem folding */
    const removeElement = useCallback(
        (nodeId) => {
            let expandedCopy = [...expandedRef.current];
            for (let i = 0; i < expandedCopy.length; i++) {
                if (expandedCopy[i] === nodeId) {
                    expandedCopy.splice(i, 1);
                }
            }
            setExpanded(expandedCopy);
        },
        [expandedRef]
    );

    const addElement = useCallback(
        (nodeId) => {
            setExpanded([...expandedRef.current, nodeId]);
        },
        [expandedRef]
    );

    const toggleDirectory = useCallback(
        (nodeId) => {
            if (expandedRef.current.includes(nodeId)) {
                removeElement(nodeId);
            } else {
                addElement(nodeId);
            }
        },
        [addElement, removeElement, expandedRef]
    );

    /* User Interaction management */
    function handleLabelClick(node, toggle) {
        onDataUpdate(node.id);

        if (toggle) {
            // update fold status of item
            toggleDirectory(node.id);
        }
    }

    function handleIconClick(nodeId) {
        if (!expandedRef.current.includes(nodeId)) {
            onDataUpdate(nodeId);
        }
        toggleDirectory(nodeId);
    }

    const handleNodeSelect = (e, values) => {
        if (multiSelect) {
            if (values.length === 1 && selectedNodes.length === 1) {
                // we must toggle selection here
                if (selectedNodes[0].id === values[0]) setSelectedNodes([]);
                else {
                    let newNode = recursiveFind(dataRef.current, values[0]);
                    if (newNode && isLeaf(newNode)) setSelectedNodes([newNode]);
                }
            } else {
                let newSelectedNodes = [];
                values.forEach((v) => {
                    let itemFound = recursiveFind(dataRef.current, v);
                    if (isLeaf(itemFound)) newSelectedNodes.push(itemFound);
                });

                if (newSelectedNodes.length > 0)
                    setSelectedNodes(newSelectedNodes);
            }
        } else {
            // we must toggle selection here
            if (selectedNodes.length === 1 && selectedNodes[0].id === values)
                setSelectedNodes([]);
            else {
                let foundNode = recursiveFind(dataRef.current, values);
                if (foundNode && isLeaf(foundNode))
                    setSelectedNodes([foundNode]);
            }
        }
    };

    /* Render */
    const getValidationButtonText = () => {
        if (validationButtonText) return validationButtonText;
        else
            return intl.formatMessage(
                { id: 'element_chooser/addElementsValidation' },
                {
                    nbElements: selectedNodes.filter((node) => isLeaf(node))
                        .length,
                }
            );
    };

    const getNodeIcon = (node) => {
        if (!node) return null;

        if (isLeaf(node) && selectedNodes.find((sn) => sn.id === node.id))
            return <CheckIcon className={classes.labelIcon} />;
        else if (node.icon)
            return <div className={classes.labelIcon}>{node.icon}</div>;
        else return null;
    };

    const renderTree = (node) => {
        if (!node) {
            return;
        }
        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={
                    <div className={classes.labelRoot}>
                        {getNodeIcon(node)}
                        <Typography className={classes.labelText}>
                            {node.name}
                        </Typography>
                    </div>
                }
                onIconClick={(event) => {
                    handleIconClick(node.id);
                    event.stopPropagation();
                }}
                onLabelClick={() => {
                    handleLabelClick(
                        node,
                        !expandedRef.current.includes(node.id)
                    );
                }}
            >
                {Array.isArray(node.children)
                    ? node.children.map((child) => renderTree(child))
                    : null}
            </TreeItem>
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={(e, r) => {
                    if (r === 'escapeKeyDown' || r === 'backdropClick')
                        onClose([]);
                    else onClose(selectedNodes);
                    setSelectedNodes([]);
                }}
                aria-labelledby="TreeViewFindertitle"
                classes={{
                    paper: classes.dialogPaper,
                }}
            >
                <DialogTitle id="TreeViewFindertitle">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="element_chooser/contentText" />
                    </DialogContentText>

                    <TreeView
                        defaultCollapseIcon={
                            <ExpandMoreIcon className={classes.icon} />
                        }
                        defaultExpandIcon={
                            <ChevronRightIcon className={classes.icon} />
                        }
                        expanded={expanded}
                        selected={selectedNodes.map((node) => node.id)}
                        onNodeSelect={handleNodeSelect}
                        multiSelect={multiSelect}
                    >
                        {dataRef.current && Array.isArray(dataRef.current)
                            ? dataRef.current.map((child) => renderTree(child))
                            : null}
                    </TreeView>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ float: 'left', margin: '5px' }}
                        onClick={() => {
                            onClose([]);
                            setSelectedNodes([]);
                        }}
                    >
                        <FormattedMessage id="element_chooser/cancel" />
                    </Button>
                    <Button
                        variant="contained"
                        style={{ float: 'left', margin: '5px' }}
                        onClick={() => {
                            onClose(
                                selectedNodes.filter((node) => isLeaf(node))
                            );
                            setSelectedNodes([]);
                        }}
                        disabled={
                            selectedNodes.filter((node) => isLeaf(node))
                                .length === 0
                        }
                    >
                        {getValidationButtonText()}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

/* TreeViewFinder props list */
TreeViewFinder.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            children: PropTypes.array,
        })
    ).isRequired,
    selected_init: PropTypes.arrayOf(PropTypes.string),
    expanded_init: PropTypes.arrayOf(PropTypes.string),
    onClose: PropTypes.func,
    onDataUpdate: PropTypes.func,
    validationButtonText: PropTypes.string,
    onlyLeaves: PropTypes.bool,
    multiSelect: PropTypes.bool,
};

/* TreeViewFinder props default values */
TreeViewFinder.defaultProps = {
    onlyLeaves: true,
    multiSelect: false,
};

export default withStyles(defaultStyles)(TreeViewFinder);
