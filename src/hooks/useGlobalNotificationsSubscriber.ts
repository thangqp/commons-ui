/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef } from 'react';
import { SnackbarKey, useSnackbar } from 'notistack';
import ReconnectingWebSocket from 'reconnecting-websocket';

const HEADER_MAINTENANCE = 'maintenance';
const HEADER_CANCEL_MAINTENANCE = 'cancelMaintenance';

/**
 * Subscribe to announcements created by admins for users (snackbar with a message which appear at the top of the page)
 */
export function useAnnouncementsSubscriber(
    webSocketUrl: string,
    token: string
) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // we use a ref to avoid useless trigger of the useEffect
    const announcementSnackbarKey = useRef<SnackbarKey>();

    useEffect(() => {
        // When the web app using this hook starts, the token is usually not ready yet
        if (!token) {
            return;
        }

        const rws = new ReconnectingWebSocket(
            webSocketUrl + '?access_token=' + token
        );

        rws.addEventListener('open', () => {
            console.info('WebSocket for announcements is connected');
        });

        rws.addEventListener('message', (event) => {
            let eventData = JSON.parse(event.data);
            if (eventData.headers.messageType === HEADER_MAINTENANCE) {
                //first we close the previous snackbar (no need to check if there is one because closeSnackbar doesn't fail on null or wrong id)
                closeSnackbar(announcementSnackbarKey.current);
                announcementSnackbarKey.current = enqueueSnackbar(
                    eventData.payload,
                    {
                        variant: 'info',
                        style: {
                            whiteSpace: 'pre-line',
                        },
                        anchorOrigin: {
                            horizontal: 'center',
                            vertical: 'top',
                        },
                        autoHideDuration: eventData.headers.duration
                            ? eventData.headers.duration * 1000
                            : null,
                    }
                );
            } else if (
                eventData.headers.messageType === HEADER_CANCEL_MAINTENANCE
            ) {
                //nothing happens if the id is null or if the snackbar it references is already closed
                closeSnackbar(announcementSnackbarKey.current);
            }
        });

        rws.addEventListener('error', (event) => {
            console.error('Unexpected announcements WebSocket error', event);
        });

        return () => rws.close();
    }, [webSocketUrl, token, closeSnackbar, enqueueSnackbar]);
}
