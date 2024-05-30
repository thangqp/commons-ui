/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import {
    GroupRuleValue,
    OperatorOption,
} from '../../../filter/expert/expert-filter.type';

type RuleValueEditorProps = ValueEditorProps & {
    ruleValue: GroupRuleValue;
};

const RuleValueEditor = (props: RuleValueEditorProps) => {
    const intl = useIntl();
    const {
        handleOnChange,
        schema: {
            controls: { valueEditor: ValueEditorControlElement },
        },
        fieldData,
        ruleValue,
    } = props;

    // set operator as the previous in rule if exists, otherwise the first operator in schema is selected
    const operator =
        ruleValue?.operator ??
        (fieldData.operators as OperatorOption[])?.map((op) => op.name)[0];

    const handleOnChangeOperator = (operator: any) => {
        console.log('operator', { operator });
        let updatedRuleValue = {
            ...(ruleValue ?? {}),
            operator: operator,
        };

        console.log('updatedRuleValue', { updatedRuleValue });

        handleOnChange(updatedRuleValue);
    };

    const handleOnChangeValue = (value: any) => {
        console.log('value', { value });
        let updatedRuleValue = {
            ...(ruleValue ?? {}),
            value: value,
            operator: operator,
        };
        console.log('updatedRuleValue', { updatedRuleValue });

        handleOnChange(updatedRuleValue);
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
                    {(fieldData.operators as OperatorOption[])?.map(
                        (operator) => (
                            <MenuItem key={operator.name} value={operator.name}>
                                {intl.formatMessage({ id: operator.label })}
                            </MenuItem>
                        )
                    )}
                </Select>
            </Grid>
            <Grid item xs={5.5}>
                <ValueEditorControlElement
                    {...{
                        ...props,
                        operator: operator,
                        handleOnChange: handleOnChangeValue,
                        value: ruleValue?.value,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default RuleValueEditor;
