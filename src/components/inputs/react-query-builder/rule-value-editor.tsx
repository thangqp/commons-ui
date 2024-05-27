/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

const RuleValueEditor = (props: ValueEditorProps) => {
    const intl = useIntl();

    const {
        schema: {
            controls: { valueEditor: ValueEditorControlElement },
        },
        fieldData,
    } = props;

    const { [props.fieldData.label]: field } = props?.value ?? {};

    const operator =
        field?.operator ??
        fieldData.operators?.map((op) => op.label)?.[0] ??
        '';

    const handleOnChangeOperator = (operator: any) => {
        console.log('operator', { operator });
        let updatedValue = {
            ...props?.value,
            [props.fieldData.label]: {
                ...props?.value?.[props.fieldData.label],
                operator: operator,
            },
        };

        console.log('updatedValue', { updatedValue });

        props.handleOnChange(updatedValue);
    };

    const handleOnChangeValue = (value: any) => {
        console.log('value', { value });
        let updatedValue = {
            ...props?.value,
            [props.fieldData.label]: {
                ...props?.value?.[props.fieldData.label],
                value: value,
            },
        };

        console.log('updatedValue', { updatedValue });

        props.handleOnChange(updatedValue);
    };

    return (
        <Grid container item spacing={1} alignItems={'center'}>
            <Grid item xs={4}>
                <Typography>
                    {intl.formatMessage({ id: props.fieldData.label })}
                </Typography>
            </Grid>
            <Grid item xs={2.5}>
                <Select
                    value={operator}
                    size={'small'}
                    onChange={(event) => {
                        handleOnChangeOperator(event.target.value);
                    }}
                    variant={'standard'}
                >
                    {fieldData.operators?.map((operator) => (
                        <MenuItem key={operator.label} value={operator.label}>
                            {intl.formatMessage({ id: operator.label })}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={5.5}>
                <ValueEditorControlElement
                    {...{
                        ...props,
                        operator: operator,
                        handleOnChange: handleOnChangeValue,
                        value: field?.value,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default RuleValueEditor;
