/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import PropTypes from 'prop-types';
import OverflowableText from '../OverflowableText';
import clsx from 'clsx';
import { EQUIPMENT_TYPE } from '../../utils/EquipmentType';

export const TagRenderer = ({ element, ...props }) => {
    if (
        element.type !== EQUIPMENT_TYPE.SUBSTATION.name &&
        element.type !== EQUIPMENT_TYPE.VOLTAGE_LEVEL.name
    )
        return (
            <OverflowableText
                text={element.voltageLevelLabel}
                className={clsx(
                    props.classes.equipmentTag,
                    props.classes.equipmentVlTag
                )}
            />
        );
    return <></>;
};

TagRenderer.propTypes = {
    element: PropTypes.object,
    classes: PropTypes.object.isRequired,
};
