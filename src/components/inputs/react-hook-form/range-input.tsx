/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useWatch } from 'react-hook-form';
import FloatInput from './numbers/float-input';
import yup from '../../../utils/yup-config';
import { FormattedMessage } from 'react-intl';
import { FunctionComponent, useMemo } from 'react';
import InputLabel from '@mui/material/InputLabel';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MuiSelectInput from './select-inputs/mui-select-input';
import { FieldConstants } from '../../../utils/field-constants';

const style = {
    inputLegend: (theme: any) => ({
        backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
        backgroundColor: theme.palette.background.paper,
        padding: '0 8px 0 8px',
    }),
};

export const RangeType = {
    EQUALITY: { id: 'EQUALITY', label: 'equality' },
    GREATER_THAN: { id: 'GREATER_THAN', label: 'greaterThan' },
    GREATER_OR_EQUAL: { id: 'GREATER_OR_EQUAL', label: 'greaterOrEqual' },
    LESS_THAN: { id: 'LESS_THAN', label: 'lessThan' },
    LESS_OR_EQUAL: { id: 'LESS_OR_EQUAL', label: 'lessOrEqual' },
    RANGE: { id: 'RANGE', label: 'range' },
};

export const DEFAULT_RANGE_VALUE = {
    [FieldConstants.OPERATION_TYPE]: RangeType.EQUALITY.id,
    [FieldConstants.VALUE_1]: null,
    [FieldConstants.VALUE_2]: null,
};
export const getRangeInputDataForm = (name: string, rangeValue: unknown) => ({
    [name]: rangeValue,
});

export const getRangeInputSchema = (name: string) => ({
    [name]: yup.object().shape(
        {
            [FieldConstants.OPERATION_TYPE]: yup.string(),
            [FieldConstants.VALUE_1]: yup
                .number()
                .when([FieldConstants.OPERATION_TYPE, FieldConstants.VALUE_2], {
                    is: (operationType: string, value2: unknown) =>
                        operationType === RangeType.RANGE.id && value2 !== null,
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema.nullable(),
                }),
            [FieldConstants.VALUE_2]: yup
                .number()
                .when([FieldConstants.OPERATION_TYPE, FieldConstants.VALUE_1], {
                    is: (operationType: string, value1: unknown) =>
                        operationType === RangeType.RANGE.id && value1 !== null,
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema.nullable(),
                }),
        },
        [[FieldConstants.VALUE_1, FieldConstants.VALUE_2]]
    ),
});

interface RangeInputProps {
    name: string;
    label: string;
}

const RangeInput: FunctionComponent<RangeInputProps> = ({ name, label }) => {
    const watchOperationType = useWatch({
        name: `${name}.${FieldConstants.OPERATION_TYPE}`,
    });

    const isOperationTypeRange = useMemo(
        () => watchOperationType === RangeType.RANGE.id,
        [watchOperationType]
    );

    const firstValueField = (
        <FloatInput
            label={''}
            name={`${name}.${FieldConstants.VALUE_1}`}
            clearable={false}
            formProps={{
                size: 'medium',
                placeholder: isOperationTypeRange ? 'Min' : '',
            }}
        />
    );

    const secondValueField = (
        <FloatInput
            name={`${name}.${FieldConstants.VALUE_2}`}
            clearable={false}
            label={''}
            formProps={{
                size: 'medium',
                placeholder: 'Max',
            }}
        />
    );

    const operationTypeField = (
        <MuiSelectInput
            name={`${name}.${FieldConstants.OPERATION_TYPE}`}
            options={Object.values(RangeType)}
            fullWidth
        />
    );

    return (
        <FormControl fullWidth>
            <InputLabel sx={style.inputLegend} shrink>
                <FormattedMessage id={label} />
            </InputLabel>
            <Grid container spacing={0}>
                <Grid
                    item
                    style={
                        isOperationTypeRange
                            ? {
                                  flex: 'min-content',
                              }
                            : {}
                    }
                >
                    {operationTypeField}
                </Grid>
                <Grid item>{firstValueField}</Grid>
                {isOperationTypeRange && <Grid item>{secondValueField}</Grid>}
            </Grid>
        </FormControl>
    );
};

export default RangeInput;
