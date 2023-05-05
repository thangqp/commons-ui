/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import OverflowableText from '../OverflowableText';
import clsx from 'clsx';
import React from 'react';
import { EQUIPMENT_TYPE } from '../../utils/EquipmentType';
import PropTypes from 'prop-types';
import { mergeSx } from '../../utils/styles';

export const TagRenderer = ({ props, element }) => {
    if (
        element.type !== EQUIPMENT_TYPE.SUBSTATION.name &&
        element.type !== EQUIPMENT_TYPE.VOLTAGE_LEVEL.name
    ) {
        return (
            <OverflowableText
                text={element.voltageLevelLabel}
                className={clsx(
                    props.classes?.equipmentTag,
                    props.classes?.equipmentVlTag
                )}
                sx={mergeSx(
                    props.styles?.equipmentTag,
                    props.styles?.equipmentVlTag
                )}
            />
        );
    }
    return <></>;
};

TagRenderer.propTypes = {
    element: PropTypes.object,
    props: PropTypes.object,
};
