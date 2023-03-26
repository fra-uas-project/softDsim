import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button
} from "@chakra-ui/react";

const ScenarioStudioAlert = (props) => {


    return (
        <>
            <AlertDialog
                isOpen={props.isOpen}
                leastDestructiveRef={props.cancelRef}
                onClose={props.onClose}
                isCentered
                motionPreset='slideInBottom'
            >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {props.title}
                </AlertDialogHeader>

                <AlertDialogBody>
                    {props.text}
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={props.cancelRef} onClick={props.onCancel}>
                        Cancel
                    </Button>
                    <Button colorScheme={props.continueButtonColor} onClick={props.onContinueButtonClick} ml={3}>
                        {props.continueButtonName ? props.continueButtonName : "Continue"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
        </AlertDialog>
        </>
    )
}

export default ScenarioStudioAlert;