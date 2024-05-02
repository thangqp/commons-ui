/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FunctionComponent } from 'react';
import { Chip } from '@mui/material';
import AutocompleteInput from '../autocomplete-input.tsx';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import { useCustomFormContext } from '../provider/use-custom-form-context.ts';

interface CountryInputProps {
    name: string;
    label: string;
}

const CountriesInput: FunctionComponent<CountryInputProps> = ({
    name,
    label,
}) => {
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language);

    return (
        <AutocompleteInput
            name={name}
            label={label}
            options={countryCodes}
            getOptionLabel={translate}
            fullWidth
            multiple
            renderTags={(val: any[], getTagsProps: any) =>
                val.map((code: string, index: number) => (
                    <Chip
                        key={code}
                        size={'small'}
                        label={translate(code)}
                        {...getTagsProps({ index })}
                    />
                ))
            }
        />
    );
};

export default CountriesInput;
