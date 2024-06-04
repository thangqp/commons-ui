/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, Theme } from '@mui/material';
import RuleValueEditor from './rule-value-editor';
import {
    GroupRuleField,
    GroupRuleValue,
} from '../../../filter/expert/expert-filter.type';
import { useCallback } from 'react';

const styles = {
    group: (theme: Theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
};

const GroupValueEditor = (props: ValueEditorProps<GroupRuleField>) => {
    const {
        handleOnChange,
        fieldData: { combinator, children = {} },
        value: { rules } = {},
    } = props;

    const generateOnChangeHandler = useCallback(
        (field: string) => (ruleValue: GroupRuleValue) => {
            handleOnChange({
                ...(props.value ?? {}),
                combinator: combinator,
                rules: {
                    ...(rules ?? {}),
                    [field]: ruleValue,
                },
            });
        },
        [handleOnChange, combinator, rules, props.value]
    );

    return (
        <Grid
            container
            direction={'column'}
            sx={styles.group}
            paddingLeft={1}
            paddingRight={1}
            paddingBottom={1}
        >
            {Object.values(children).map((fieldData) => (
                <RuleValueEditor
                    {...props}
                    key={fieldData.name}
                    field={fieldData.name}
                    fieldData={fieldData}
                    ruleValue={rules?.[fieldData.name]}
                    handleOnChange={generateOnChangeHandler(fieldData.name)}
                />
            ))}
        </Grid>
    );
};

export default GroupValueEditor;
