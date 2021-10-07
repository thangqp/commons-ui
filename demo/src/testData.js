/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';

/* Icons for customization*/
import FlashOnIcon from '@material-ui/icons/FlashOn';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import WavesIcon from '@material-ui/icons/Waves';
import EcoIcon from '@material-ui/icons/Eco';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FiberNewIcon from '@material-ui/icons/FiberNew';

var PokemonTree = [
    {
        id: 'D1',
        name: 'Team',
        icon: <FolderOpenIcon />,
        children: [
            {
                id: '1',
                parentId: 'D1',
                name: 'Pikachu',
                type: 'Electric',
                power: '23',
                icon: <FlashOnIcon />,
            },
            {
                id: '2',
                parentId: 'D1',
                name: 'Spectrum',
                type: 'Spectre',
                power: '51',
            },
            {
                id: '3',
                parentId: 'D1',
                name: 'Roucoups',
                type: 'Vol',
                power: '42',
            },
            {
                id: '4',
                parentId: 'D1',
                name: 'Lamantin',
                type: 'Glace',
                power: '127',
                icon: <AcUnitIcon />,
            },
            {
                id: '5',
                parentId: 'D1',
                name: 'Mew',
                type: 'Psy',
                power: '134',
            },
            {
                id: '6',
                parentId: 'D1',
                name: 'Machoc',
                type: 'Combat',
                power: '64',
            },
        ],
    },
    {
        id: 'D2',
        name: 'Reserve',
        icon: <FolderOpenIcon />,
        children: [
            {
                id: '7',
                parentId: 'D2',
                name: 'Dracofeu',
                type: 'Feu',
                power: '84',
                icon: <WhatshotIcon />,
            },
            {
                id: '8',
                parentId: 'D2',
                name: 'Florizard',
                type: 'Plante',
                power: '72',
                icon: <EcoIcon />,
            },
            {
                id: '9',
                parentId: 'D2',
                name: 'Tortank',
                type: 'Eau',
                power: '78',
                icon: <WavesIcon />,
            },
            {
                id: '10',
                parentId: 'D2',
                name: 'Artikodin',
                type: 'Glace',
                power: '133',
                icon: <AcUnitIcon />,
            },
        ],
    },
    {
        id: 'D3',
        name: 'Empty Collect',
        icon: <FolderOpenIcon />,
        children: [],
    },
];

var PokemonList = [
    {
        id: '1',
        name: 'Pikachu',
        type: 'Electric',
        power: '23',
        icon: <FlashOnIcon />,
    },
    { id: '2', name: 'Spectrum', type: 'Spectre', power: '51' },
    { id: '3', name: 'Roucoups', type: 'Vol', power: '42' },
    {
        id: '4',
        name: 'Lamantin',
        type: 'Glace',
        power: '127',
        icon: <AcUnitIcon />,
    },
    { id: '5', name: 'Mew', type: 'Psy', power: '134' },
    { id: '6', name: 'Machoc', type: 'Combat', power: '64' },
];

var IDCounter = 100; // Start at 100 to avoid conflicts for demo
function fetchInfinitePokemonList() {
    IDCounter++;
    PokemonList = [
        ...PokemonList,
        {
            id: IDCounter.toString(),
            name: 'Métamorph_' + new Date().getTime(),
            type: 'Normal',
            power: '1',
            icon: <FiberNewIcon />,
        },
    ];
    return PokemonList;
}

function fetchInfinitePokemonTree(nodeId) {
    IDCounter++;

    let PokemonTreeCopy = [...PokemonTree];
    const dirFound = PokemonTreeCopy.find((element) => element.id === nodeId);

    if (dirFound) {
        dirFound.children.push({
            id: IDCounter.toString(),
            name: 'Métamorph_' + new Date().getTime(),
            type: 'Normal',
            power: '1',
            icon: <FiberNewIcon />,
        });
    }

    PokemonTree = PokemonTreeCopy;
    return PokemonTree;
}

export {
    PokemonTree as testDataTree,
    PokemonList as testDataList,
    fetchInfinitePokemonTree as fetchInfiniteTestDataTree,
    fetchInfinitePokemonList as fetchInfiniteTestDataList,
};
