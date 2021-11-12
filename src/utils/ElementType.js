/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import DescriptionIcon from '@material-ui/icons/Description';
import FilterListIcon from '@material-ui/icons/FilterList';

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
            return <DescriptionIcon className={theme} />;
        case elementType.FILTER:
            return <FilterListIcon className={theme} />;
        case elementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
