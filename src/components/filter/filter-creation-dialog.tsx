/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback } from 'react';
import {
    saveCriteriaBasedFilter,
    saveExpertFilter,
    saveExplicitNamingFilter,
} from './utils/filter-api';
import { Resolver, useForm } from 'react-hook-form';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import CustomMuiDialog from '../dialogs/custom-mui-dialog';
import {
    criteriaBasedFilterEmptyFormData,
    criteriaBasedFilterSchema,
} from './criteria-based/criteria-based-filter-form';
import {
    explicitNamingFilterSchema,
    FILTER_EQUIPMENTS_ATTRIBUTES,
    getExplicitNamingFilterEmptyFormData,
} from './explicit-naming/explicit-naming-filter-form';
import { FieldConstants } from '../../utils/field-constants';
import yup from '../../utils/yup-config';
import { FilterForm } from './filter-form';
import {
    EXPERT_FILTER_QUERY,
    expertFilterSchema,
    getExpertFilterEmptyFormData,
} from './expert/expert-filter-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { elementExistsType } from './criteria-based/criteria-based-filter-edition-dialog';
import { UUID } from 'crypto';
import { MergedFormContextProps } from '../inputs/react-hook-form/provider/custom-form-provider';
import { StudyMetadata } from '../../hooks/predefined-properties-hook.ts';

import { FilterContext } from './filter-context';
import { FilterType } from './constants/filter-constants';
import { ElementAttributes } from '../../utils/types.ts';

const emptyFormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.FILTER_TYPE]: FilterType.CRITERIA_BASED.id,
    [FieldConstants.EQUIPMENT_TYPE]: null,
    ...criteriaBasedFilterEmptyFormData,
    ...getExplicitNamingFilterEmptyFormData(),
    ...getExpertFilterEmptyFormData(),
};

// we use both schemas then we can change the type of filter without losing the filled form fields
const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.DESCRIPTION]: yup
            .string()
            .max(500, 'descriptionLimitError'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...criteriaBasedFilterSchema,
        ...explicitNamingFilterSchema,
        ...expertFilterSchema,
    })
    .required();

export interface FilterCreationDialogProps {
    open: boolean;
    onClose: () => void;
    activeDirectory?: UUID;
    createFilter: (
        filter: any,
        name: string,
        description: string,
        activeDirectory: any
    ) => Promise<void>;
    saveFilter: (filter: any, name: string) => Promise<void>;
    fetchAppsAndUrls: () => Promise<StudyMetadata[]>;
    elementExists?: elementExistsType;
    language?: string;
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
}

const FilterCreationDialog: FunctionComponent<FilterCreationDialogProps> = ({
    open,
    onClose,
    activeDirectory,
    createFilter,
    saveFilter,
    fetchAppsAndUrls,
    elementExists,
    language,
    fetchDirectoryContent,
    fetchRootFolders,
    fetchElementsInfos,
}) => {
    const { snackError } = useSnackMessage();

    const formMethods = {
        ...useForm({
            defaultValues: emptyFormData,
            resolver: yupResolver(formSchema) as unknown as Resolver,
        }),
        language: language,
    } as MergedFormContextProps;

    const {
        formState: { errors },
    } = formMethods;

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

    const onSubmit = useCallback(
        (filterForm: any) => {
            if (
                filterForm[FieldConstants.FILTER_TYPE] ===
                FilterType.EXPLICIT_NAMING.id
            ) {
                saveExplicitNamingFilter(
                    filterForm[FILTER_EQUIPMENTS_ATTRIBUTES],
                    true,
                    filterForm[FieldConstants.EQUIPMENT_TYPE],
                    filterForm[FieldConstants.NAME],
                    filterForm[FieldConstants.DESCRIPTION],
                    null,
                    (error: any) => {
                        snackError({
                            messageTxt: error,
                        });
                    },
                    onClose,
                    createFilter,
                    saveFilter,
                    activeDirectory
                );
            } else if (
                filterForm[FieldConstants.FILTER_TYPE] ===
                FilterType.CRITERIA_BASED.id
            ) {
                saveCriteriaBasedFilter(
                    filterForm,
                    activeDirectory,
                    onClose,
                    (error: any) => {
                        snackError({
                            messageTxt: error,
                        });
                    },
                    createFilter
                );
            } else if (
                filterForm[FieldConstants.FILTER_TYPE] === FilterType.EXPERT.id
            ) {
                saveExpertFilter(
                    null,
                    filterForm[EXPERT_FILTER_QUERY],
                    filterForm[FieldConstants.EQUIPMENT_TYPE],
                    filterForm[FieldConstants.NAME],
                    filterForm[FieldConstants.DESCRIPTION],
                    true,
                    activeDirectory,
                    onClose,
                    (error: any) => {
                        snackError({
                            messageTxt: error,
                        });
                    },
                    createFilter,
                    saveFilter
                );
            }
        },
        [activeDirectory, snackError, onClose, createFilter, saveFilter]
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={'createNewFilter'}
            removeOptional={true}
            disabledSave={!!nameError || !!isValidating}
        >
            <FilterContext.Provider
                value={{
                    fetchDirectoryContent: fetchDirectoryContent,
                    fetchRootFolders: fetchRootFolders,
                    fetchElementsInfos: fetchElementsInfos,
                    fetchAppsAndUrls: fetchAppsAndUrls,
                }}
            >
                <FilterForm
                    creation
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                />
            </FilterContext.Provider>
        </CustomMuiDialog>
    );
};

export default FilterCreationDialog;
