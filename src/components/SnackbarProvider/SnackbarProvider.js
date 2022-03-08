/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useRef } from 'react';
import Button from '@mui/material/Button';

import { SnackbarProvider as OrigSnackbarProvider } from 'notistack';

/* A wrapper around notistack's SnackbarProvider that provides defaults props */
const SnackbarProvider = React.forwardRef((props, ref) => {
    // create our own ref and use it if the parent
    // did not create a ref for us.
    const innerRef = useRef();
    const notistackRef = ref || innerRef;

    return (
        <OrigSnackbarProvider
            ref={notistackRef}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            hideIconVariant={true}
            action={(key) => (
                <Button
                    onClick={() => notistackRef.current.closeSnackbar(key)}
                    style={{ color: '#fff', fontSize: '20px' }}
                >
                    ✖
                </Button>
            )}
            {...props}
        />
    );
});

export default SnackbarProvider;
