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
import { UUID } from 'crypto';

import { FilterType } from './constants/filter-constants';

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
    language?: string;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
}

const FilterCreationDialog: FunctionComponent<FilterCreationDialogProps> = ({
    open,
    onClose,
    activeDirectory,
    language,
    sourceFilterForExplicitNamingConversion = undefined,
}) => {
    const { snackError } = useSnackMessage();

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema) as unknown as Resolver,
    });

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
                    }
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
                    }
                );
            }
        },
        [activeDirectory, snackError, onClose]
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={
                sourceFilterForExplicitNamingConversion
                    ? 'convertIntoExplicitNamingFilter'
                    : 'createNewFilter'
            }
            removeOptional={true}
            disabledSave={!!nameError || !!isValidating}
            language={language}
        >
            <FilterForm
                creation
                activeDirectory={activeDirectory}
                sourceFilterForExplicitNamingConversion={
                    sourceFilterForExplicitNamingConversion
                }
            />
        </CustomMuiDialog>
    );
};

export default FilterCreationDialog;
