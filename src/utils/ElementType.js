/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';

export const elementType = {
    DIRECTORY: 'DIRECTORY',
    STUDY: 'STUDY',
    FILTER: 'FILTER',
    MODIFICATION: 'MODIFICATION',
    CONTINGENCY_LIST: 'CONTINGENCY_LIST',
    VOLTAGE_INIT_PARAMETERS: 'VOLTAGE_INIT_PARAMETERS',
    SECURITY_ANALYSIS_PARAMETERS: 'SECURITY_ANALYSIS_PARAMETERS',
    LOADFLOW_PARAMETERS: 'LOADFLOW_PARAMETERS',
};

export function getFileIcon(type, style) {
    switch (type) {
        case elementType.STUDY:
            return <LibraryBooksOutlinedIcon sx={style} />;
        case elementType.CONTINGENCY_LIST:
            return <OfflineBoltIcon sx={style} />;
        case elementType.MODIFICATION:
            return <NoteAltIcon sx={style} />;
        case elementType.FILTER:
            return <ArticleIcon sx={style} />;
        case elementType.VOLTAGE_INIT_PARAMETERS:
        case elementType.SECURITY_ANALYSIS_PARAMETERS:
        case elementType.LOADFLOW_PARAMETERS:
            return <SettingsIcon sx={style} />;
        case elementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
