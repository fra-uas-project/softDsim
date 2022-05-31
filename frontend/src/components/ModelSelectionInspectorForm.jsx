import {
    Box,
    Checkbox,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormLabel,
    VStack
} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import {useEffect, useState} from "react";

const ModelSelectionInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.modelSelectionData?.displayName);

    const [models, setModels] = useState(["Kanban", "Scrum", "Waterfall"])

    const onChangeDisplayName = (value) => {
        setDisplayName(value)
    }

    useEffect(() => {
        props.modelSelectionData.displayName = displayName;
    }, [displayName, props.modelSelectionData])

    return (
        <VStack maxW="300px" alignItems="flex-start">
            <Editable value={displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)}>
                <EditablePreview
                    w="full"
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer",
                    }}
                />
                <EditableInput/>
            </Editable>
            <Divider/>
            <Box h={3}/>
            <MarkdownTextfield
                data={props.modelSelectionData}
            />
            <Box h={3}/>
            <FormControl flexDir="column" display="flex">
                <FormLabel color="gray.400" htmlFor="">Available Management Models</FormLabel>
                {models.map((value, index) => {
                    return <Checkbox key={index} spacing='1rem' mb="0.5rem">{value}</Checkbox>
                })}
            </FormControl>
        </VStack>
    )
}

export default ModelSelectionInspectorForm;