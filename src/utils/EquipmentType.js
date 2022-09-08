/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { LIGHT_THEME } from '../components/TopBar/TopBar';

export const TYPE_TAG_MAX_SIZE = '90px';
export const VL_TAG_MAX_SIZE = '100px';

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
        color: theme === LIGHT_THEME ? 'inherit' : 'black',
    },
    equipmentTypeTag: {
        minWidth: TYPE_TAG_MAX_SIZE,
        maxWidth: TYPE_TAG_MAX_SIZE,
        background: 'lightblue',
    },
    equipmentVlTag: {
        width: VL_TAG_MAX_SIZE,
        minWidth: VL_TAG_MAX_SIZE,
        maxWidth: VL_TAG_MAX_SIZE,
        background: 'lightgray',
        fontStyle: 'italic',
    },
    result: {
        width: '100%',
        padding: '2px',
    },
});

// Must be equivalent as the back enum
export const EQUIPMENT_TYPE = {
    SUBSTATION: {
        name: 'SUBSTATION',
        tagLabel: 'equipment_search/substationTag',
    },
    VOLTAGE_LEVEL: {
        name: 'VOLTAGE_LEVEL',
        tagLabel: 'equipment_search/voltageLevelTag',
    },
    LINE: {
        name: 'LINE',
        tagLabel: 'equipment_search/lineTag',
    },
    TWO_WINDINGS_TRANSFORMER: {
        name: 'TWO_WINDINGS_TRANSFORMER',
        tagLabel: 'equipment_search/2wtTag',
    },
    THREE_WINDINGS_TRANSFORMER: {
        name: 'THREE_WINDINGS_TRANSFORMER',
        tagLabel: 'equipment_search/3wtTag',
    },
    HVDC_LINE: {
        name: 'HVDC_LINE',
        tagLabel: 'equipment_search/hvdcLineTag',
    },
    GENERATOR: {
        name: 'GENERATOR',
        tagLabel: 'equipment_search/generatorTag',
    },
    BATTERY: {
        name: 'BATTERY',
        tagLabel: 'equipment_search/batteryTag',
    },
    LOAD: {
        name: 'LOAD',
        tagLabel: 'equipment_search/loadTag',
    },
    SHUNT_COMPENSATOR: {
        name: 'SHUNT_COMPENSATOR',
        tagLabel: 'equipment_search/shuntTag',
    },
    DANGLING_LINE: {
        name: 'DANGLING_LINE',
        tagLabel: 'equipment_search/lineTag',
    },
    STATIC_VAR_COMPENSATOR: {
        name: 'STATIC_VAR_COMPENSATOR',
        tagLabel: 'equipment_search/svcTag',
    },
    HVDC_CONVERTER_STATION: {
        name: 'HVDC_CONVERTER_STATION',
        tagLabel: 'equipment_search/hvdcStationTag',
    },
    BUSBAR_SECTION: {
        name: 'BUSBAR_SECTION',
        tagLabel: 'equipment_search/busbarSectionTag',
    },
    BUS: {
        name: 'BUS',
        tagLabel: 'equipment_search/busTag',
    },
    SWITCH: {
        name: 'SWITCH',
        tagLabel: 'equipment_search/switchTag',
    },
};

export const getEquipmentsInfosForSearchBar = (
    equipmentsInfos,
    equipmentLabelling
) => {
    return equipmentsInfos.flatMap((e) => {
        let label = equipmentLabelling ? e.name : e.id;
        return e.type === 'SUBSTATION'
            ? [
                  {
                      label: label,
                      id: e.id,
                      key: e.id,
                      type: e.type,
                  },
              ]
            : e.voltageLevels.map((vli) => {
                  return {
                      label: label,
                      id: e.id,
                      key: e.id + '_' + vli.id,
                      type: e.type,
                      voltageLevelLabel: equipmentLabelling ? vli.name : vli.id,
                      voltageLevelId: vli.id,
                  };
              });
    });
};
