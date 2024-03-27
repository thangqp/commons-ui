/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import ReportViewer from '../ReportViewer';

const styles = {
    fullScreenIcon: {
        cursor: 'pointer',
    },
    paperFullWidth: {
        height: '100%',
    },
};

export default function ReportViewerDialog(props) {
    const { title, open, onClose, jsonReport } = props;

    const [fullScreen, setFullScreen] = useState(false);

    const showFullScreen = () => {
        setFullScreen(true);
    };

    const hideFullScreen = () => {
        setFullScreen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            aria-labelledby="dialog-title-report"
            fullWidth={true}
            maxWidth="lg"
            sx={{
                '& .MuiDialog-paperFullWidth': styles.paperFullWidth,
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers={true}>
                <ReportViewer jsonReport={jsonReport} />
            </DialogContent>
            <DialogActions>
                {fullScreen ? (
                    <FullscreenExitIcon
                        onClick={hideFullScreen}
                        sx={styles.fullScreenIcon}
                    />
                ) : (
                    <FullscreenIcon
                        onClick={showFullScreen}
                        sx={styles.fullScreenIcon}
                    />
                )}
                <Button onClick={() => onClose()} variant="text">
                    <FormattedMessage id="report_viewer/close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
