import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    HStack,
    ListItem,
    Text,
    UnorderedList
} from "@chakra-ui/react";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {Fragment} from "react";
import styled from "@emotion/styled";
import InspectorListElement from "./InspectorListElement";
import {HiOutlinePlus} from "react-icons/hi";
import {finalActionList} from "../scenarioStudioData";
import {v4 as uuidv4} from 'uuid';
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const Clone = styled(ListItem)`
  margin-bottom: 12px;

  + li {
    display: none !important;
    background-color: blueviolet;
  }
`;

const InspectorItemSelector = (props) => {

    const copyAllActions = () => {
        // Creating a deep copy (deep copy does not copy functions (icon)
        const actionListItems = JSON.parse(JSON.stringify(finalActionList));

        for (let i = 0; i < finalActionList.length; i++) {
            actionListItems[i].id = uuidv4();
            actionListItems[i].icon = finalActionList[i].icon
        }
        return actionListItems
    }

    return (
        <>
            <FormControl isInvalid={isError(props.validationErrors, props.parentData.id, props.validationErrorObjectKey)}>
                <HStack justifyContent="space-between" w="full">
                    <Text color="gray.400" fontWeight="semibold">{props.headline}</Text>
                    {props.addActions &&
                        <Button
                            variant="solid"
                            size="xs"
                            leftIcon={<HiOutlinePlus/>}
                            onClick={() => {
                                props.addActions(copyAllActions())
                            }}
                        >Add all</Button>
                    }
                </HStack>
                    {isError(props.validationErrors, props.parentData.id, props.validationErrorObjectKey) ?
                        <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.parentData.id, props.validationErrorObjectKey)}>
                            {getErrorMessage(props.validationErrors, props.parentData.id, props.validationErrorObjectKey)}
                        </FormErrorMessage>
                        : <FormHelperText></FormHelperText>}

            </FormControl>
            <Droppable droppableId={props.droppableId} isDropDisabled={true} type={props.type}>
                {(provided) => (
                    <UnorderedList
                        listStyleType="none"
                        ref={provided.innerRef}
                    >

                        {props.itemList.map(({id, title, content, icon}, index) => {
                                return (
                                    <Draggable
                                        key={id}
                                        draggableId={id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Fragment>
                                                <ListItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    mb={3}
                                                >
                                                    <InspectorListElement title={title} content={content} icon={icon}/>
                                                </ListItem>
                                                {snapshot.isDragging &&
                                                    <Clone>
                                                        <InspectorListElement title={title} content={content} icon={icon}/>
                                                    </Clone>}
                                            </Fragment>
                                        )}
                                    </Draggable>
                                )
                            }
                        )
                        }
                        {provided.placeholder}
                    </UnorderedList>
                )}
            </Droppable>
        </>
    )
}

export default InspectorItemSelector;