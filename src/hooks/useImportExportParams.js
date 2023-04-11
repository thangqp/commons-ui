/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Hook taking an array of parameters with this format
// [{"name":"nameOfParam","type":"typeOfParam","description":"descriptionOfParam","defaultValue":"defaultValue","possibleValues":[arrayOfPossibleValue]}]
// Returns :
// - an object containing those modified values to be able to send them to a backend
// - a render of a form allowing to modify those values
// - a function allowing to reset the fields

import React, { useCallback, useMemo, useRef, useState } from 'react';
import FlatParameters from '../components/FlatParameters/FlatParameters';

const ListRE = /^\[(.*)]$/;
const sepRE = /[, ]/;

function extractDefault(paramDescription) {
    const d = paramDescription.defaultValue;
    if (paramDescription.type === 'BOOLEAN') return !!d;
    if (paramDescription.type === 'DOUBLE') return d - 0.0;
    if (paramDescription.type === 'INTEGER') return d - 0;
    if (paramDescription.type === 'STRING_LIST') {
        if (Array.isArray(d)) return d;
        const mo = ListRE.exec(d);
        if (mo?.length > 1) {
            return mo[1]
                .split(sepRE)
                .map((s) => s.trim())
                .filter((s) => !!s);
        }
        return [];
    }
    return d ?? null;
}

function areEquivDeeply(a, b) {
    if (a === b) return true;
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray || bIsArray) {
        if (aIsArray && bIsArray && a.length === b.length) {
            let i = 0;
            for (; i < a.length && areEquivDeeply(a[i], b[i]); ++i) {}
            if (i >= a.length) return true;
        }
        return false;
    }
    const aIsObj = typeof a === 'object';
    const bIsObj = typeof b === 'object';
    if (aIsObj || bIsObj) {
        return (
            aIsObj &&
            bIsObj &&
            areEquivDeeply(Object.entries(a), Object.entries(b))
        );
    }

    return false;
}

export function extractDefaultMap(paramsAsArray) {
    return Object.fromEntries(
        paramsAsArray.map((paramDescription) => {
            return [paramDescription.name, extractDefault(paramDescription)];
        })
    );
}

export function makeDeltaMap(defaultMap, changingMap) {
    if (!changingMap) return null;

    const delta = {};

    Object.entries(defaultMap).forEach(([k, v]) => {
        const m = changingMap[k];
        if (!areEquivDeeply(v, m)) {
            console.debug('Δ', k, v, m);
            delta[k] = m;
        }
    });

    return Object.keys(delta).length ? delta : null;
}

function makeFullMap(defaultMap, changingMap) {
    if (!changingMap) return { ...defaultMap };

    const full = {};

    Object.entries(defaultMap).forEach(([k, v]) => {
        if (!changingMap.hasOwnProperty(k)) {
            full[k] = v;
        } else {
            const m = changingMap[k];
            if (!areEquivDeeply(v, m)) {
                full[k] = m;
            } else {
                full[k] = v;
            }
        }
    });

    return full;
}

export const useImportExportParams = (
    paramsAsArray,
    initValues,
    returnsDelta = true
) => {
    const defaultValues = useMemo(() => {
        return extractDefaultMap(paramsAsArray);
    }, [paramsAsArray]);
    const baseValues = useMemo(() => {
        return makeFullMap(defaultValues, initValues);
    }, [defaultValues, initValues]);

    const [currentValues, setCurrentValues] = useState(baseValues);
    const prevRef = useRef();

    const onChange = useCallback((paramName, value, isEdit) => {
        console.debug('useImportExportParams.onChange', {
            isEdit,
            paramName,
            value,
        });
        if (!isEdit) {
            setCurrentValues((prevCurrentValues) => {
                return {
                    ...prevCurrentValues,
                    ...{ [paramName]: value },
                };
            });
        }
    }, []);

    const resetValuesToDefault = useCallback(
        (isToInit = true) => {
            setCurrentValues(isToInit ? baseValues : defaultValues);
        },
        [defaultValues, baseValues]
    );

    const jsx = useMemo(() => {
        return (
            <FlatParameters
                paramsAsArray={paramsAsArray}
                initValues={currentValues}
                onChange={onChange}
            />
        );
    }, [paramsAsArray, currentValues, onChange]);

    let ret;
    if (
        prevRef.current &&
        areEquivDeeply(prevRef.current.currentValues, currentValues)
    ) {
        if (!returnsDelta) {
            ret = [prevRef.current.currentValues, jsx, resetValuesToDefault];
        } else if (!prevRef.current.deltaValues) {
            ret = [
                makeDeltaMap(defaultValues, currentValues),
                jsx,
                resetValuesToDefault,
            ];
        } else {
            ret = [prevRef.current.deltaValues, jsx, resetValuesToDefault];
        }
    } else {
        ret = [
            returnsDelta
                ? makeDeltaMap(defaultValues, currentValues)
                : currentValues,
            jsx,
            resetValuesToDefault,
        ];
    }

    prevRef.current = {
        currentValues,
        jsx: ret[1],
        deltaValues: returnsDelta ? ret[0] : null,
    };

    return ret;
};
