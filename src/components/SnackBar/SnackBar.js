/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { useSnackbar, withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: 'inline',
        margin: 16,
    },
}));

const SnackBar = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    /*
     * Function is called if you want to show snackbar notification via button click
     */
    const handleClick = (props) => () => {
        enqueueSnackbar(props.message, { variant: props.variant });
    };

    useEffect(() => {
        if (!props.showBtnAction) {
            enqueueSnackbar(props.message, { variant: props.variant });
        }
    }, [enqueueSnackbar, props.message, props.variant, props.showBtnAction]);

    return (
        <>
            {props.showBtnAction ? (
                <Paper className={classes.root}>
                    <Button
                        key={props.variant}
                        variant="contained"
                        onClick={handleClick(props)}
                    >
                        {props.textBtnAction}
                    </Button>
                </Paper>
            ) : null}
        </>
    );
};

export default withSnackbar(SnackBar);
