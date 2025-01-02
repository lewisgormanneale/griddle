import {useEffect} from "react";

export function Timer({
                          time,
                          setTime,
                          timerActive,
                      }: {
    time: number;
    setTime: Function;
    timerActive: boolean;
}) {
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTime((time: number) => time + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timerActive, setTime]);

    return <div>Time: {time}s</div>;
}
