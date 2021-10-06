import { useToast } from "@chakra-ui/toast";
import { notificationAtom } from "../../recoil/notifications/atom";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { Box } from "@chakra-ui/layout";

export const Notifications = () => {
    const notificationText = useRecoilValue(notificationAtom)
    const toast = useToast();

    useEffect(() => {
        if (notificationText){
            toast({
                position: "bottom-right",
                render: () => (
                    <Box color="white" p={3} bg="blue.500">
                        {notificationText}
                    </Box>
                ),
            })
        }
    }, [notificationText])

    return <></>
}