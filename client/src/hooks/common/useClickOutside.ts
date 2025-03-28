import { useEffect, RefObject } from "react";

// ref 영역의 바깥을 클릭하면 해당 ref의 요소를 닫음
export function useClickOutside(
    ref: RefObject<HTMLElement>,
    callback: () => void,
    excludedRef?: RefObject<HTMLElement>
) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // ref 바깥을 클릭했고 excludedRef를 클릭한 것이 아닐 때
            if (ref.current &&
                !ref.current.contains(event.target as Node) &&
                !(excludedRef?.current && excludedRef.current.contains(event.target as Node))) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback, excludedRef]);
}