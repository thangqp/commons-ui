import { createContext } from 'react';
import { UUID } from 'crypto';
import { ElementAttributes } from '../DirectoryItemSelector/directory-item-selector';
import { StudyMetadata } from '../../hooks/predefined-properties-hook';

export type FilterContextProps = {
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
};
export const FilterContext = createContext<FilterContextProps>({
    fetchDirectoryContent: undefined,
    fetchRootFolders: undefined,
    fetchElementsInfos: undefined,
    fetchAppsAndUrls: undefined,
});
