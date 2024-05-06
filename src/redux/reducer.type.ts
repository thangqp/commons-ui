/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface CommonReduxState {
    user: User;
}

interface User {
    id_token: string;
    access_token: string;
    token_type: string;
    scope: string;
    profile: Profile;
    expires_at: number;
}

interface Profile {
    sub: string;
    name: string;
    email: string;
    s_hash: string;
}
