import {atom} from 'recoil';
import { NotificationBoxProps } from '../../components/Notifications';
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// When the notification atom state is updated a notification will be generated for the user to see

export const notificationAtom = atom({
    key: "notification",
    default: undefined as NotificationBoxProps | undefined,
})

    