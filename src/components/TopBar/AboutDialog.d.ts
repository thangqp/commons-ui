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
    appVersion?: string;
    appLicense?: string;
    getGlobalVersion?: (setVersion: React.SetStateAction<string>) => void;
    getLogoThemed?: (themeMode: PaletteMode) => React.ReactElement;
    getAdditionalComponents?: (setComponents: React.SetStateAction<AboutAdditionalComponent[]>) => void;
}>;

export default AboutDialog;
