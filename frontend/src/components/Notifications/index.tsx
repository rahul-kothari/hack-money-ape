import { useToast } from "@chakra-ui/toast";
import { notificationAtom } from "../../recoil/notifications/atom";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { Box } from "@chakra-ui/layout";

export const Notifications = () => {
    const notification = useRecoilValue(notificationAtom)
    const toast = useToast();

    useEffect(() => {
        if (notification){
            toast({
                position: "bottom-right",
                render: () => (
                    <NotificationBox
                        text={notification.text}
                        type={notification.type}
                    />
                ),
            })
        }
    }, [notification])

    return <></>
}

interface NotificationBoxProps {
    text: string,
    type: "ERROR" | "SUCCESS" | "GENERAL"
}

const NotificationBox: React.FC<NotificationBoxProps> = (props) => {
    const {text, type} = props;

    const color = (() => {
        switch(type){
            case "ERROR":
                return "red.300"
            case "SUCCESS":
                return "green.300"
            case "GENERAL":
                return "indigo.400"
            default:
                return "indigo.400"
        }
    })()

    return <Box color="white" p={3} bg={color}>
        {text}
    </Box>

}