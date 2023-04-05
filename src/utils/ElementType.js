/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import ArticleIcon from '@mui/icons-material/Article';

export const elementType = {
    DIRECTORY: 'DIRECTORY',
    STUDY: 'STUDY',
    FILTER: 'FILTER',
    CONTINGENCY_LIST: 'CONTINGENCY_LIST',
};

export function getFileIcon(type, theme) {
    switch (type) {
        case elementType.STUDY:
            return <LibraryBooksOutlinedIcon className={theme} />;
        case elementType.CONTINGENCY_LIST:
            return <OfflineBoltIcon className={theme} />;
        case elementType.FILTER:
            return <ArticleIcon className={theme} />;
        case elementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
