export const intervalCallback = (callback: (t: number) => void, interval = 0) => {
    let current = 0;
    return () => {
        callback(current);
        current += interval;
    }
}