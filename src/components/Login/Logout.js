/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.error.main,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        borderRadius: '30px',
    },
    logo: {
        width: 64,
        height: 64,
    },
}));

const Logout = ({ onLogoutClick, disabled }) => {
    const classes = useStyles();

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="#">
                    GridSuite
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LogoutOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <FormattedMessage
                        id="login/logout"
                        defaultMessage={'logout'}
                    />{' '}
                    ?
                </Typography>

                <Button
                    disabled={disabled}
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    onClick={onLogoutClick}
                >
                    <FormattedMessage
                        id="login/logout"
                        defaultMessage={'logout'}
                    />
                </Button>
            </div>
            <Box mt={2}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default Logout;
