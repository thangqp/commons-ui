/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import clsx from 'clsx';
import React from 'react';

export const TYPE_TAG_MAX_SIZE = '120px';
export const VL_TAG_MAX_SIZE = '65px';

export const equipmentStyles = (theme) => ({
    equipmentOption: {
        display: 'flex',
        gap: '20px',
        width: '100%',
        margin: '0px',
        padding: '0px',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    equipmentTag: {
        borderRadius: '10px',
        padding: '4px',
        fontSize: 'x-small',
        textAlign: 'center',
    },
    equipmentTypeTag: {
        width: TYPE_TAG_MAX_SIZE,
        background: 'lightblue',
    },
    equipmentVlTag: {
        width: VL_TAG_MAX_SIZE,
        background: 'lightgray',
        fontStyle: 'italic',
    },
});

// Must be equivalent as the back enum (Powsybl)
export const EQUIPMENT_TYPE = {
    SUBSTATION: {
        name: 'SUBSTATION',
        sortOrder: 0,
        tagLabel: 'equipment_search/substationTag',
    },
    VOLTAGE_LEVEL: {
        name: 'VOLTAGE_LEVEL',
        sortOrder: 1,
        tagLabel: 'equipment_search/voltageLevelTag',
    },
    LINE: {
        name: 'LINE',
        sortOrder: 2,
        tagLabel: 'equipment_search/voltageLevelTag',
    },
    TWO_WINDINGS_TRANSFORMER: {
        name: 'TWO_WINDINGS_TRANSFORMER',
        sortOrder: 3,
        tagLabel: 'equipment_search/2wtTag',
    },
    THREE_WINDINGS_TRANSFORMER: {
        name: 'THREE_WINDINGS_TRANSFORMER',
        sortOrder: 4,
        tagLabel: 'equipment_search/3wtTag',
    },
    HVDC: {
        name: 'HVDC',
        sortOrder: 5,
        tagLabel: 'equipment_search/hvdcLinkTag',
    },
    GENERATOR: {
        name: 'GENERATOR',
        sortOrder: 6,
        tagLabel: 'equipment_search/generatorTag',
    },
    BATTERY: {
        name: 'BATTERY',
        sortOrder: 7,
        tagLabel: 'equipment_search/batteryTag',
    },
    LOAD: {
        name: 'LOAD',
        sortOrder: 8,
        tagLabel: 'equipment_search/loadTag',
    },
    SHUNT_COMPENSATOR: {
        name: 'SHUNT_COMPENSATOR',
        sortOrder: 9,
        tagLabel: 'equipment_search/shuntTag',
    },
    DANGLING_LINE: {
        name: 'DANGLING_LINE',
        sortOrder: 10,
        tagLabel: 'equipment_search/lineTag',
    },
    STATIC_VAR_COMPENSATOR: {
        name: 'STATIC_VAR_COMPENSATOR',
        sortOrder: 11,
        tagLabel: 'equipment_search/svcTag',
    },
    HVDC_CONVERTER_STATION: {
        name: 'HVDC_CONVERTER_STATION',
        sortOrder: 12,
        tagLabel: 'equipment_search/hvdcStationTag',
    },
    BUSBAR_SECTION: {
        name: 'BUSBAR_SECTION',
        sortOrder: 13,
        tagLabel: 'equipment_search/busbarSectionTag',
    },
    BREAKER: {
        name: 'BREAKER',
        sortOrder: 14,
        tagLabel: 'equipment_search/switchTag',
    },
    DISCONNECTOR: {
        name: 'DISCONNECTOR',
        sortOrder: 15,
        tagLabel: 'equipment_search/switchTag',
    },
    LOAD_BREAK_SWITCH: {
        name: 'LOAD_BREAK_SWITCH',
        sortOrder: 16,
        tagLabel: 'equipment_search/switchTag',
    },
};

export const getEquipmentsInfosForSearchBar = (
    equipmentsInfos,
    equipmentLabelling
) => {
    return equipmentsInfos
        .flatMap((e) => {
            let label = equipmentLabelling ? e.name : e.id;
            return e.type === 'SUBSTATION'
                ? [
                      {
                          label: label,
                          id: e.id,
                          type: e.type,
                      },
                  ]
                : e.voltageLevelsIds.map((vli) => {
                      return {
                          label: label,
                          id: e.id,
                          type: e.type,
                          voltageLevelId: vli,
                      };
                  });
        })
        .sort(sortEquipments);
};

const sortEquipments = (a, b) => {
    return EQUIPMENT_TYPE[a.type].sortOrder < EQUIPMENT_TYPE[b.type].sortOrder
        ? -1
        : EQUIPMENT_TYPE[a.type].sortOrder > EQUIPMENT_TYPE[b.type].sortOrder
        ? 1
        : a.label.localeCompare(b.label);
};

export const renderEquipmentForSearchBar = (classes, intl) => {
    return (element, { inputValue }) => {
        let matches = match(element.label, inputValue);
        let parts = parse(element.label, matches);
        return (
            <div className={classes.equipmentOption}>
                <span
                    className={clsx(
                        classes.equipmentTag,
                        classes.equipmentTypeTag
                    )}
                >
                    {intl.formatMessage({
                        id: EQUIPMENT_TYPE[element.type].tagLabel,
                    })}
                </span>
                <div className={classes.equipmentOption}>
                    <span>
                        {parts.map((part, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight: part.highlight
                                        ? 'bold'
                                        : 'inherit',
                                }}
                            >
                                {part.text}
                            </span>
                        ))}
                    </span>
                    {element.type !== EQUIPMENT_TYPE.SUBSTATION.name &&
                        element.type !== EQUIPMENT_TYPE.VOLTAGE_LEVEL.name && (
                            <span
                                className={clsx(
                                    classes.equipmentTag,
                                    classes.equipmentVlTag
                                )}
                            >
                                {element.voltageLevelId}
                            </span>
                        )}
                </div>
            </div>
        );
    };
};
