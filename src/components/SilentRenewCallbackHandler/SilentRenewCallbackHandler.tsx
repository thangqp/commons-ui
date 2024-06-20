/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { UserManager } from 'oidc-client';

export interface SilentRenewCallbackHandlerProps {
    userManager: UserManager;
    handleSilentRenewCallback: () => void;
}

function SilentRenewCallbackHandler({
    userManager,
    handleSilentRenewCallback,
}: Readonly<SilentRenewCallbackHandlerProps>) {
    useEffect(() => {
        if (userManager !== null) {
            handleSilentRenewCallback();
        }
    }, [userManager, handleSilentRenewCallback]);

    return <h1>Technical token renew window, you should not see this</h1>;
}

export default SilentRenewCallbackHandler;
