/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
const SnackBar = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    if (props.message && props.variant) {
        enqueueSnackbar(props.message, { variant: props.variant });
    }
    return null;
};

SnackBar.propTypes = {
    message: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
};

export default SnackBar;
