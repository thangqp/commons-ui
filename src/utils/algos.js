export function equalsArray(a, b) {
    if (!b || !a) return false;
    if (b === a) return true;
    if (a.length !== b.length) return false;

    for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (!a[i].equals(b[i])) return false;
        } else if (a[i] !== b[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
