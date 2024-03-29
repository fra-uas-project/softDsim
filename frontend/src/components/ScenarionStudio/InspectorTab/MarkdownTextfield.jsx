import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import SimpleMDE from "react-simplemde-editor";
import {HiOutlineExternalLink} from "react-icons/hi";
import {useCallback} from "react";
import styled from "@emotion/styled";
import "easymde/dist/easymde.min.css";

// necessary because chakra ui resets all basic styles
const MDE = styled(SimpleMDE)`
  all: revert;

  .editor-preview * {
    all: revert;
  }
  
  table {
    border-collapse: collapse !important;
  }
  
  th, td {
    border: 1px solid #ddd !important;
    padding: 5px !important;
  }

  .EasyMDEContainer .CodeMirror {
    border-radius: 10px;
  }
  
  .editor-toolbar {
    border: none;
  }
`;

const mdeOptionsLess = {
    toolbar: false,
    spellChecker: false,
    placeholder: "Enter markdown",
    status: false,
    maxHeight: "50px",
};

const mdeOptionsFull = {
    spellChecker: false,
    placeholder: "Enter markdown",
    status: false,
};

const MarkdownTextfield = (props) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const onChange = useCallback((value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.data.id)
                component.text = value;
            })
    }, [props]);

    return (
        <>
            <FormControl w="300px">
                <FormLabel htmlFor='text' color="gray.400" fontWeight="semibold">Story</FormLabel>
                <Box sx={props.errorBorderColor ?
                    {
                        ".EasyMDEContainer .CodeMirror":
                            {
                                borderColor: `${props.errorBorderColor}`,
                                boxShadow: `0 0 0 1px var(--chakra-colors-${props.errorBorderColor.split(".")[0]}-${props.errorBorderColor.split(".")[1]})` // Changing format of color so that it is valid
                            }
                    } : undefined}>
                    <MDE
                        options={mdeOptionsLess}
                        value={props.data.text}
                        onChange={onChange}
                    />
                </Box>
                <FormHelperText mt="-20px" mr="5px" display="flex" justifyContent="flex-end">
                    <IconButton icon={<HiOutlineExternalLink />} size="2xs" transform="scaleX(-1)" onClick={onOpen} aria-label="Open editor"/>
                </FormHelperText>
            </FormControl>


            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='slideInBottom' size="3xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Story</ModalHeader>
                    <ModalBody>
                        <MDE
                            options={mdeOptionsFull}
                            value={props.data.text}
                            onChange={onChange}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant='solid'
                            colorScheme="blue"
                            size="sm"
                            rightIcon={<HiOutlineExternalLink style={{transform: "scaleY(-1)"}}/>}
                            onClick={onClose}
                        >Done</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MarkdownTextfield;