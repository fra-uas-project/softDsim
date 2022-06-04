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
    const [models, setModels] = useState([]);

    const allModels = ["Kanban", "Scrum", "Waterfall"];

    const onChangeModels = (event) => {
        if(models.includes(event.target.value)) {
            setModels(models.filter((element) => {return element !== event.target.value}))
        }else {
            setModels(prevState => [...prevState, event.target.value])
        }
    }

    const onChangeDisplayName = (value) => {
        setDisplayName(value)
    }

    useEffect(() => {
        props.modelSelectionData.displayName = displayName;
        props.modelSelectionData.models = models;
    }, [displayName, models, props.modelSelectionData])

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
                {allModels.map((value, index) => {
                    return <Checkbox key={index} spacing='1rem' mb="0.5rem" value={value} onChange={(event) => onChangeModels(event)}>{value}</Checkbox>
                })}
            </FormControl>
        </VStack>
    )
}

export default ModelSelectionInspectorForm;