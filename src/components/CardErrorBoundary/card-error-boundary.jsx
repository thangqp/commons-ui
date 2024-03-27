/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// adapted from
//    https://reactjs.org/docs/error-boundaries.html
//    https://mui.com/material-ui/react-card/#complex-interaction

import { Component } from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Replay as ReplayIcon,
} from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

class CardErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            expanded: false,
            error: undefined,
        };
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.handleReloadClick = this.handleReloadClick.bind(this);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('CardErrorBoundary caught: ', error, errorInfo);
    }

    handleExpandClick() {
        this.setState((state) => ({ expanded: !state.expanded }));
    }

    handleReloadClick() {
        this.setState((state) => ({
            hasError: false,
            expanded: false,
            error: undefined,
        }));
    }

    render() {
        if (this.state.hasError) {
            const { error, expanded } = this.state;
            return (
                <Box sx={{ p: 4 }}>
                    <Card sx={{ mx: 'auto', maxWidth: 600 }}>
                        <CardHeader
                            title={
                                <FormattedMessage
                                    id="card_error_boundary/title"
                                    defaultMessage="Sorry, Unexpected error :("
                                />
                            }
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                <FormattedMessage
                                    id="card_error_boundary/content"
                                    defaultMessage="Please reload, or close and reopen this application, or contact support."
                                />
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton
                                onClick={this.handleReloadClick}
                                aria-label="reload"
                            >
                                <ReplayIcon />
                            </IconButton>
                            <ExpandMore
                                expand={expanded}
                                onClick={this.handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded}>
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <FormattedMessage
                                        id="card_error_boundary/expandederrorheader"
                                        defaultMessage="Error message (and see more information in the developper console):"
                                    />
                                </Typography>
                                <Typography variant="caption">
                                    {error.message}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default CardErrorBoundary;
