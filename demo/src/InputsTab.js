import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AutocompleteInput from '../../src/components/rhf-inputs/autocomplete-input';
import TextInput from '../../src/components/rhf-inputs/text-input';
import RadioInput from '../../src/components/rhf-inputs/radio-input';
import SliderInput from '../../src/components/rhf-inputs/slider-input';
import FloatInput from '../../src/components/rhf-inputs/numbers/float-input';
import IntegerInput from '../../src/components/rhf-inputs/numbers/integer-input';
import SelectInput from '../../src/components/rhf-inputs/select-input';
import CheckboxInput from '../../src/components/rhf-inputs/booleans/checkbox-input';
import SwitchInput from '../../src/components/rhf-inputs/booleans/switch-input';

const AUTOCOMPLETE_INPUT = 'autocomplete';
const TEXT_INPUT = 'text';
const SLIDER_INPUT = 'slider';
const SELECT_INPUT = 'select';
const RADIO_INPUT = 'radio';
const INTEGER_INPUT = 'integer';
const FLOAT_INPUT = 'float';
const CHECKBOX_INPUT = 'checkbox';
const SWITCH_INPUT = 'switch';

const emptyFormData = {
    [AUTOCOMPLETE_INPUT]: '',
    [TEXT_INPUT]: '',
    [SLIDER_INPUT]: null,
    [SELECT_INPUT]: '',
    [RADIO_INPUT]: '',
    [INTEGER_INPUT]: null,
    [FLOAT_INPUT]: null,
    [CHECKBOX_INPUT]: null,
    [SWITCH_INPUT]: null,
};

const formSchema = yup.object().shape({
    [AUTOCOMPLETE_INPUT]: yup.string(),
    [TEXT_INPUT]: yup.string(),
    [SLIDER_INPUT]: yup.number(),
    [SELECT_INPUT]: yup.string(),
    [RADIO_INPUT]: yup.string(),
    [INTEGER_INPUT]: yup.number(),
    [FLOAT_INPUT]: yup.number(),
    [CHECKBOX_INPUT]: yup.boolean(),
    [SWITCH_INPUT]: yup.boolean(),
});

const options = [
    { id: 'kiki', label: 'inputs/kylianMbappe' },
    { id: 'goat', label: 'inputs/goat' },
    { id: 'president', label: 'inputs/president' },
    { id: 'goldenBall2023', label: 'inputs/goldenBall2023' },
];

const basicOptions = ['Kylian Mbappé', 'GOAT', 'Président', "Ballon d'or 2023"];

const gridSize = 4;

const areIdsEqual = (val1, val2) => {
    return val1.id === val2.id;
};

export function InputsTab() {
    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema),
    });

    //TODO validation button and submit

    return (
        <FormProvider validationSchema={formSchema} {...formMethods}>
            <Box sx={{ margin: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={gridSize}>
                        <AutocompleteInput
                            name={AUTOCOMPLETE_INPUT}
                            options={basicOptions}
                            label={'inputs/autocomplete'}
                            isOptionEqualToValue={areIdsEqual}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <TextInput name={TEXT_INPUT} label={'inputs/text'} />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SliderInput
                            name={SLIDER_INPUT}
                            label={'inputs/slider'}
                            min={0.0}
                            max={100.0}
                            step={0.1}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SelectInput
                            name={SELECT_INPUT}
                            label={'inputs/select'}
                            options={options}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <RadioInput
                            name={RADIO_INPUT}
                            label={'inputs/radio'}
                            options={options}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <IntegerInput
                            name={INTEGER_INPUT}
                            label={'inputs/integer'}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <FloatInput name={FLOAT_INPUT} label={'inputs/float'} />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <CheckboxInput
                            name={CHECKBOX_INPUT}
                            label={'inputs/checkbox'}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SwitchInput
                            name={SWITCH_INPUT}
                            label={'inputs/switch'}
                        />
                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    );
}
