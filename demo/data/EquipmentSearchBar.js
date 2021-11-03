/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getEquipmentsInfosForSearchBar } from '../../src';

const NETWORK_UUID = '00000000-1111-2222-3333-444444444444';
const EQUIPMENTS = [
    {
        id: 'ident1',
        name: 'name1',
        type: 'LOAD',
        voltageLevelsIds: ['POSTEP7'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident12',
        name: 'name12',
        type: 'LOAD',
        voltageLevelsIds: ['POSTEP6'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident13',
        name: 'name13',
        type: 'LOAD',
        voltageLevelsIds: ['POSTEP5'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident14',
        name: 'name14',
        type: 'LOAD',
        voltageLevelsIds: [
            '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-vlid4',
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident15veryveryveryveryveryveryveryveryveryveryveryveryveryverylongid',
        name: '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-b6eax',
        type: 'LOAD',
        voltageLevelsIds: [
            '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-b6eax',
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident2',
        name: 'name2',
        type: 'GENERATOR',
        voltageLevelsIds: ['vl2'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident3 with spaces',
        name: 'name3 with spaces',
        type: 'BREAKER',
        voltageLevelsIds: ['vl3'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident4',
        name: 'name4',
        type: 'HVDC',
        voltageLevelsIds: ['vl41', 'vl42'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident5',
        name: 'name5',
        type: 'SUBSTATION',
        voltageLevelsIds: ['vl51', 'vl52'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident6',
        name: 'name6',
        type: 'VOLTAGE_LEVEL',
        voltageLevelsIds: ['vl6'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident7',
        name: 'name7',
        type: 'LINE',
        voltageLevelsIds: ['vl71', 'vl72'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident8',
        name: 'name8',
        type: 'TWO_WINDINGS_TRANSFORMER',
        voltageLevelsIds: ['vl81', 'vl82'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident9',
        name: 'name9',
        type: 'THREE_WINDINGS_TRANSFORMER',
        voltageLevelsIds: ['vl91', 'vl92'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident10',
        name: 'name10',
        type: 'CONFIGURED_BUS',
        voltageLevelsIds: ['vl10'],
        networkUuid: NETWORK_UUID,
    },
];

export const searchEquipments = (searchTerm, equipmentLabelling) => {
    if (searchTerm) {
        return getEquipmentsInfosForSearchBar(
            equipmentLabelling
                ? EQUIPMENTS.filter((equipment) =>
                      equipment.name.includes(searchTerm)
                  )
                : EQUIPMENTS.filter((equipment) =>
                      equipment.id.includes(searchTerm)
                  ),
            equipmentLabelling
        );
    } else {
        return [];
    }
};
