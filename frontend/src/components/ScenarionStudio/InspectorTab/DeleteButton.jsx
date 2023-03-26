import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button, Box,
    useDisclosure
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {actionEnum, questionEnum} from "../scenarioStudioData";

const DeleteButton = (props) => {
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose} = useDisclosure();
    const cancelRef = useRef();

    const deleteComponent = () => {
        props.setSelectedObject(null)

        props.updateEditorList(
            (draft) => {
                if (props.component.type === actionEnum.ACTION) {
                    for (const fragment of draft) {
                        if (fragment?.actions) {
                            fragment.actions = fragment.actions.filter(action => action.id !== props.component.id)
                        }
                    }
                    return draft
                } else if (props.component.type === questionEnum.SINGLE || props.component.type === questionEnum.MULTI) {
                    for (const fragment of draft) {
                        if (fragment?.questions) {
                            fragment.questions = fragment.questions.filter(question => question.id !== props.component.id)
                        }
                    }
                    return draft
                } else {
                    return draft.filter((component) => component.id !== props.component.id)
                }
            }
        )
    };

    return (
        <Box w="full" pb={5}>
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
                            Are you sure that you want to delete {props.component.displayName}? You can't undo this
                            action afterwards.
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
        </Box>
    )
}

export default DeleteButton;