import React, { useState } from 'react';
import {Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalHeader} from '@chakra-ui/react';

interface Props {
}

const Modal = (props: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div>
            <ChakraModal
                isOpen={isOpen}
                onClose={()=>setIsOpen(false)}
            >
                <ModalContent>
                    <ModalHeader>
                        Connect Wallet
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        Test wallet connects
                    </ModalBody>
                </ModalContent>
            </ChakraModal>
            <button
                onClick={()=>setIsOpen(true)}
            >
                open
            </button>
        </div>
    )
}

export default Modal
