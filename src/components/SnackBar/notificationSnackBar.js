/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { useSnackbar } from 'notistack';

const NotificationMessageSnackBar = (data) => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (data.message.message && data.message.variant) {
            enqueueSnackbar(data.message.message, {
                variant: data.message.variant,
            });
        }
    }, [enqueueSnackbar, data.message.message, data.message.variant]);

    return <Paper></Paper>;
};

export default NotificationMessageSnackBar;
