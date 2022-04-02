import { useState } from "react";
import { IEditable } from "@epam/uui";

export const useValue = <TValue>(initialValue: TValue | (() => TValue)): IEditable<TValue> => {
    const [value, onValueChange] = useState(initialValue);
    return { value, onValueChange };
};