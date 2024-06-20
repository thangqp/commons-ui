/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import {
    ElementSearchInput,
    ElementSearchInputProps,
} from './element-search-input';

export interface ElementSearchDialogProps<T>
    extends ElementSearchInputProps<T> {
    onClose?: () => void;
    open: boolean;
}

export function ElementSearchDialog<T>(
    props: Readonly<ElementSearchDialogProps<T>>
) {
    const { open, onClose, onSearchTermChange, ...rest } = props;

    const handleClose = useCallback(() => {
        onSearchTermChange('');
        onClose?.();
    }, [onSearchTermChange, onClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableRestoreFocus
            aria-labelledby="dialog-title-search"
            fullWidth
        >
            <DialogContent>
                <ElementSearchInput
                    onSearchTermChange={onSearchTermChange}
                    {...rest}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ElementSearchDialog;
