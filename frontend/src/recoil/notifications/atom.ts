import {atom} from 'recoil';

export const notificationAtom = atom({
    key: "notification",
    default: undefined as {text: string, type: "ERROR" | "SUCCESS" | "GENERAL"} | undefined,
})

    