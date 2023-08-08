/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useController } from 'react-hook-form';
import FieldErrorAlert from './field-error-alert';

const ErrorInput = ({ name, InputField = FieldErrorAlert }) => {
    const {
        fieldState: { error },
    } = useController({
        name,
    });

    const errorProps = (errorMsg) => {
        if (typeof errorMsg === 'string') {
            return {
                id: errorMsg,
            };
        } else if (typeof errorMsg === 'object') {
            return {
                id: errorMsg.id,
                values: {
                    value: errorMsg.value,
                },
            };
        }
        return {};
    };

    return (
        error?.message && (
            <InputField
                message={<FormattedMessage {...errorProps(error?.message)} />}
            />
        )
    );
};

export default ErrorInput;
