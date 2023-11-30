/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent } from 'react';
import { PaletteMode } from '@mui/material';

export type AboutAdditionalComponent = {
    readonly name: string;
    readonly type?: "app" | "server" | "other";
    readonly version?: string;
    readonly gitTag?: string;
    readonly license?: string;
};

export const AboutDialog: FunctionComponent<{
    open: boolean;
    onClose?: () => void;
    appName: string;
    appVersion?: string;
    appLicense?: string;
    getGlobalVersion?: (setVersion: React.SetStateAction<string>) => void;
    getLogoThemed?: (themeMode: PaletteMode) => React.ReactElement;
    getAdditionalComponents?: (setComponents: React.SetStateAction<AboutAdditionalComponent[]>) => void;
}>;

export default AboutDialog;
