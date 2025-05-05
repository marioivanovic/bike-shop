import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [valueStored, setValueStored] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (e) {
            console.log(e);
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(valueStored));
    }, [key, valueStored]);

    return [valueStored, setValueStored]
};
