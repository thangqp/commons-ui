import {extractDefault} from "../components/FlatParameters/FlatParameters";

const areEquivDeeply = (a, b) => {
    if (a === b) {
        return true;
    }

    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray || bIsArray) {
        if (aIsArray && bIsArray && a.length === b.length) {
            let i = 0;
            while (i < a.length && areEquivDeeply(a[i], b[i])) {
                ++i;
            }
            if (i >= a.length) {
                return true;
            }
        }
        return false;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    return areEquivDeeply(Object.entries(a), Object.entries(b));
}
export const extractDefaultMap = (paramsAsArray) => {
    return Object.fromEntries(
        paramsAsArray.map((paramDescription) => {
            return [paramDescription.name, extractDefault(paramDescription)];
        })
    );
}

export const makeDeltaMap = (defaultMap, changingMap) => {
    if (!changingMap) {
        return null;
    }

    const delta = {};

    Object.entries(defaultMap).forEach(([k, v]) => {
        const m = changingMap[k];
        if (!areEquivDeeply(v, m)) {
            delta[k] = m;
        }
    });

    return Object.keys(delta).length ? delta : null;
}