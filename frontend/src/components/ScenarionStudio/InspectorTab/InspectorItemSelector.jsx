import {Button, HStack, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {Fragment} from "react";
import styled from "@emotion/styled";
import InspectorListElement from "./InspectorListElement";
import {HiOutlinePlus} from "react-icons/hi";
import {finalActionList} from "../scenarioStudioData";

const Clone = styled(ListItem)`
  margin-bottom: 12px;

  + li {
    display: none !important;
    background-color: blueviolet;
  }
`;

const InspectorItemSelector = (props) => {

    return (
        <>
            <HStack justifyContent="space-between" w="full">
            <Text color="gray.400" fontWeight="semibold">{props.headline}</Text>
            { props.addActions &&
                <Button
                    variant="solid"
                    size="xs"
                    leftIcon={<HiOutlinePlus/>}
                    onClick={() => {props.addActions(finalActionList)}}
                >Add all</Button>
            }
            </HStack>
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