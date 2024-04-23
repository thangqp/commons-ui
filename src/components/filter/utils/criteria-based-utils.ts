/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../constants/field-constants';
import yup from '../../../utils/yup-config';
import {
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from '../../react-hook-form/range-input.tsx';

export const getCriteriaBasedSchema = (extraFields: any) => ({
    [FieldConstants.CRITERIA_BASED]: yup.object().shape({
        [FieldConstants.COUNTRIES]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_1]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_2]: yup.array().of(yup.string()),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_1),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_2),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_3),
        ...extraFields,
    }),
});

export const getCriteriaBasedFormData = (
    criteriaValues: any,
    extraFields: any
) => ({
    [FieldConstants.CRITERIA_BASED]: {
        [FieldConstants.COUNTRIES]:
            criteriaValues?.[FieldConstants.COUNTRIES] ?? [],
        [FieldConstants.COUNTRIES_1]:
            criteriaValues?.[FieldConstants.COUNTRIES_1] ?? [],
        [FieldConstants.COUNTRIES_2]:
            criteriaValues?.[FieldConstants.COUNTRIES_2] ?? [],
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_1,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_1] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_2,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_2] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_3,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_3] ??
                DEFAULT_RANGE_VALUE
        ),
        ...extraFields,
    },
});
