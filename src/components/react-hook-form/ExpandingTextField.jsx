/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TextInput } from '../..';

const ExpandingTextField = ({
    name,
    maxCharactersNumber,
    rows,
    minRows = 1,
    maxRows,
    sx,
    label,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { control } = useFormContext();
    const descriptionWatch = useWatch({
        name: name,
        control,
    });
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const maxCounter = maxCharactersNumber ?? 500;
    const isOverTheLimit = descriptionWatch?.length > maxCounter;
    const descriptionCounter = useMemo(() => {
        const descriptionLength = descriptionWatch?.length ?? 0;
        return descriptionLength + '/' + maxCounter;
    }, [descriptionWatch, maxCounter]);

    const rowsToDisplay = isFocused ? rows : minRows;

    const formProps = {
        size: 'medium',
        multiline: true,
        onFocus: handleFocus,
        onBlur: handleBlur,
        InputProps: {
            endAdornment: (
                <InputAdornment
                    color={'red'}
                    position="end"
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 8,
                    }}
                >
                    <div
                        style={{
                            color: isOverTheLimit ? 'red' : 'inherit',
                        }}
                    >
                        {descriptionCounter}
                    </div>
                </InputAdornment>
            ),
            style: {
                textOverflow: 'ellipsis',
                overflow: 'hidden', // disable scrolling
                whiteSpace: 'pre',
                resize: 'none', // or 'horizontal' for horizontal resizing
            },
        },
        ...(minRows && { minRows: minRows }),
        ...(rowsToDisplay && { rows: rowsToDisplay }),
        ...(maxRows && { maxRows: maxRows }),
        ...(sx && { sx: sx }),
    };
    return <TextInput name={name} label={label} formProps={formProps} />;
};

export default ExpandingTextField;
