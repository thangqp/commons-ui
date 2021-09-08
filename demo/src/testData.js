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

const PokemonDictionary = [
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
];

const PokemonDictionaryFlat = [
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

function getPokemonDictionary(nodeId) {
    let team = [];
    if (!nodeId) team = PokemonDictionary;
    else
        team = [
            ...PokemonDictionary,
            {
                id: 'D3',
                name: 'NEW',
                icon: <FolderOpenIcon />,
                children: [
                    {
                        id: '11',
                        parentId: 'D3',
                        name: 'Raichu',
                        type: 'Electric',
                        power: '83',
                        icon: <FlashOnIcon />,
                    },
                    {
                        id: '12',
                        parentId: 'D3',
                        name: 'Papillusion',
                        type: 'Insect',
                        power: '79',
                    },
                ],
            },
        ];
    return team;
}

function getPokemonDictionaryFlat(nodeId) {
    let team = [];
    if (!nodeId) team = PokemonDictionaryFlat;
    else
        team = [
            ...PokemonDictionaryFlat,
            {
                id: '11',
                name: 'Raichu (NEW)',
                type: 'Electric',
                power: '83',
            },
            {
                id: '12',
                name: 'Papillusion (NEW)',
                type: 'Insect',
                power: '79',
            },
        ];
    return team;
}

export {
    PokemonDictionary as testDataDictionary,
    PokemonDictionaryFlat as testDataDictionaryFlat,
    getPokemonDictionary as getTestDataDictionary,
    getPokemonDictionaryFlat as getTestDataDictionaryFlat,
};
