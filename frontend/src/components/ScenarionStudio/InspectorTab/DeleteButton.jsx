import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button, useDisclosure
} from "@chakra-ui/react";
import {useRef} from "react";

const DeleteButton = (props) => {
    const { isOpen: isDeleteOpen , onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef();

    const deleteComponent = () => {
        props.setSelectedObject(null)

        props.updateEditorList(
            (draft) => {
                const updatedEditorList = draft.filter((component) => component.id !== props.component.id)
                return updatedEditorList
            })
    };

    return(
        <>
        <Button
            w="full"
            colorScheme="red"
            onClick={onDeleteOpen}
        >
            Delete component
        </Button>


            {/*Delete user alert pop up*/}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
                motionPreset='slideInBottom'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete component
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure that you want to delete {props.component.displayName}? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={() => {
                                deleteComponent()
                                onDeleteClose()
                            }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteButton;