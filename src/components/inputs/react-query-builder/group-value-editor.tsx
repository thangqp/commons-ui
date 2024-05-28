/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FullField, ValueEditorProps } from 'react-querybuilder';
import { Grid } from '@mui/material';
import RuleValueEditor from './rule-value-editor';

interface GroupField extends FullField {
    combinator?: string;
    rules?: FullField[];
}

const GroupValueEditor = (props: ValueEditorProps<GroupField>) => {
    console.log('GroupValueEditor props', { props });
    const {
        fieldData: { rules },
    } = props;

    return (
        <Grid container direction={'column'} spacing={1}>
            {rules?.map((rule) => (
                <RuleValueEditor
                    {...{
                        ...props,
                        key: rule.name,
                        field: rule.name,
                        fieldData: rule,
                    }}
                />
            ))}
        </Grid>
    );
};

export default GroupValueEditor;
