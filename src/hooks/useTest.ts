import { useState } from 'react';

//TODO FM to remove (for the review)
export function useTest(value: string) {
    const [valeur, setValeur] = useState(value);

    return { valeur, setValeur };
}
