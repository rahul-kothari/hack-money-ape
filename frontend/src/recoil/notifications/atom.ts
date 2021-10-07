import {atom} from 'recoil';
import { NotificationBoxProps } from '../../components/Notifications';

export const notificationAtom = atom({
    key: "notification",
    default: undefined as NotificationBoxProps | undefined,
})

    