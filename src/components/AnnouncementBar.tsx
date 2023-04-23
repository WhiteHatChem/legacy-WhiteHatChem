import { useCallback } from "preact/hooks";
import { useLocalStorage } from "../common/hooks";

export function useAnnouncementBar(lastAnnouncementDate: Date): [boolean, () => void] {
    const [ lastAckAnnounce, setLastAckAnnounce ] = useLocalStorage<number | null>("lastackannounce", null);
    const acknowledgeLastAnnounce = useCallback(() => {
        setLastAckAnnounce(Date.now());
    }, [setLastAckAnnounce])

    // If no previous record return true
    if (lastAckAnnounce === null) { return [ true, acknowledgeLastAnnounce ]; }

    let lastAckDate = new Date(lastAckAnnounce);

    // if last time checked is before the last announce return true else false 
    return [ (lastAckDate < lastAnnouncementDate), acknowledgeLastAnnounce ];
};

interface Props {
    LAST_ANNOUNCE: Date,
    children: JSX.Element
}

function AnnouncementBar({ LAST_ANNOUNCE, children }: Props) {
    const [ showAnnounce, toggleAnnounce ] = useAnnouncementBar(LAST_ANNOUNCE)

    return (showAnnounce ? <div className="
        relative text-neutral-800 dark:text-neutral-200
        bg-gradient-to-r from-blue-200/60 to-violet-200/60
        hover:from-blue-200/90 hover:to-violet-200/90
        dark:from-indigo-800/80 dark:to-violet-800/80
        dark:hover:from-blue-800/60 dark:hover:to-violet-800/60
    ">
        <div className="py-1.5 px-4 flex justify-center text-center">
            { children }
        </div>
        <button
            onClick={toggleAnnounce}
            className="absolute px-1 inset-y-0 right-0"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div> : null)
}

export default AnnouncementBar;
