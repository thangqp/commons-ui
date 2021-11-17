/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';

export const OverflowableText = ({ text, children, className }) => {
    const element = useRef();
    const [overflowed, setOverflowed] = useState(false);

    const checkOverflow = useCallback(() => {
        if (!element.current) return;
        setOverflowed(
            element.current.scrollWidth > element.current.clientWidth
        );
    }, [setOverflowed, element]);

    useEffect(() => {
        checkOverflow();
    }, [checkOverflow]);

    return (
        <Tooltip title={text || ''} disableHoverListener={!overflowed}>
            <div ref={element} className={className}>
                {children || text}
            </div>
        </Tooltip>
    );
};

OverflowableText.propTypes = {
    children: PropTypes.object,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OverflowableText;
