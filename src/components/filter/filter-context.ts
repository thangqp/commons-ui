/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createContext } from 'react';
import { UUID } from 'crypto';
import { StudyMetadata } from '../../hooks/predefined-properties-hook';
import { ElementAttributes } from '../../utils/types.ts';

interface FilterContextProps {
    fetchDirectoryContent?: (
        directoryUuid: UUID,
        elementTypes: string[]
    ) => Promise<ElementAttributes[]>;
    fetchRootFolders?: (types: string[]) => Promise<ElementAttributes[]>;
    fetchElementsInfos?: (
        ids: UUID[],
        elementTypes?: string[],
        equipmentTypes?: string[]
    ) => Promise<ElementAttributes[]>;
    fetchAppsAndUrls?: () => Promise<StudyMetadata[]>;
}
export const FilterContext = createContext<FilterContextProps>({
    fetchDirectoryContent: undefined,
    fetchRootFolders: undefined,
    fetchElementsInfos: undefined,
    fetchAppsAndUrls: undefined,
});
