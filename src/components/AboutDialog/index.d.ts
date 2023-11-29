import { FunctionComponent } from 'react';
import { PaletteMode } from '@mui/material';

export const AboutDialog: FunctionComponent<{
    open: boolean;
    onClose?: () => void;
    appVersion?: string;
    appLicense?: string;
    getGlobalVersion?: (setVersion: React.SetStateAction<string>) => void;
    getLogoThemed?: (themeMode: PaletteMode) => React.ReactElement;
}>;

export default AboutDialog;
