import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview, FormControl, FormHelperText,
    FormLabel, HStack, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper, Select,
    VStack
} from "@chakra-ui/react";
import {useState} from "react";
import InspectorItemSelector from "./InspectorItemSelector";
import MarkdownTextfield from "./MarkdownTextfield";

const FragmentInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.fragmentData?.displayName);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

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
            <Divider />
            <Box h={3}/>
            <MarkdownTextfield
                data={props.fragmentData}
            />
            <Box h={3}/>
            <FormControl>
                <FormLabel color="gray.400" htmlFor="">End Condition</FormLabel>
                <Select placeholder='Select condition'>
                    <option value='option1'>Budget</option>
                    <option value='option2'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='option3'>Stress Level</option>
                    <option value='option4'>Motivation</option>
                </Select>
                <FormHelperText></FormHelperText>

                <HStack>
                    <Select w={20}>
                        <option value='ge'>{">="}</option>
                        <option value='le'>{"<="}</option>
                    </Select>


                <NumberInput min={0} id="budget"  onChange={(value) => "handleChangeBudget(value)"}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                    <FormHelperText mt={1} mx={1}>Type</FormHelperText>
                    <FormHelperText mt={1} mx={1}>Limit</FormHelperText>
                </HStack>

                <Box h={3}/>
            </FormControl>
            <InspectorItemSelector
                droppableId="actionList"
                itemList={props.finalActionList}
                type="action"
                headline="Action Types"
            />
        </VStack>
    )
}

export default FragmentInspectorForm;