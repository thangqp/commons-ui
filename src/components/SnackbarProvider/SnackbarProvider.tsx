/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useRef } from 'react';
import { Button } from '@mui/material';

import {
    SnackbarProvider as OrigSnackbarProvider,
    SnackbarProviderProps,
} from 'notistack';

/* A wrapper around notistack's SnackbarProvider that provides defaults props */
const SnackbarProvider = (props: SnackbarProviderProps) => {
    const ref = useRef<OrigSnackbarProvider>(null);

    return (
        <OrigSnackbarProvider
            ref={ref}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            hideIconVariant={true}
            action={(key) => (
                <Button
                    onClick={() => ref.current?.closeSnackbar(key)}
                    style={{ color: '#fff', fontSize: '20px' }}
                >
                    ✖
                </Button>
            )}
            {...props}
        />
    );
};

export default SnackbarProvider;
