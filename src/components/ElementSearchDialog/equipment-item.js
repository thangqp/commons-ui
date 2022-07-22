/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TagRenderer } from './index';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import OverflowableText from '../OverflowableText';
import React from 'react';
import { EQUIPMENT_TYPE } from '../../utils/EquipmentType';

export const EquipmentItem = ({
    inputValue,
    suffixRenderer = TagRenderer,
    element,
    showsJustText = false,
    ...props
}) => {
    let matches = match(element.label, inputValue, {
        insideWords: true,
        findAllOccurrences: true,
    });
    let parts = parse(element.label, matches);
    /* override li.key otherwise it will use label which could be duplicated */
    return (
        <li key={element.key} {...props}>
            <div className={props.classes.equipmentOption}>
                {!showsJustText && (
                    <span
                        className={clsx(
                            props.classes.equipmentTag,
                            props.classes.equipmentTypeTag
                        )}
                    >
                        <FormattedMessage
                            id={EQUIPMENT_TYPE[element.type].tagLabel}
                        />
                    </span>
                )}
                <OverflowableText
                    text={parts.map((e) => e.text).join()}
                    className={props.classes.result}
                >
                    {parts.map((part, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: part.highlight ? 'bold' : 'inherit',
                            }}
                        >
                            {part.text}
                        </span>
                    ))}
                </OverflowableText>
                {!showsJustText && suffixRenderer({ props, element })}
            </div>
        </li>
    );
};
