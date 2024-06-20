/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';

type FieldLabelProps = {
    label: string;
    optional?: boolean;
    values?: any;
};
function FieldLabel({
    label,
    optional = false,
    values = undefined,
}: Readonly<FieldLabelProps>) {
    return (
        <>
            <FormattedMessage id={label} values={values} />
            {optional && <FormattedMessage id="Optional" />}
        </>
    );
}

export default FieldLabel;
