import {ListItem, TabPanel, Text, UnorderedList, VStack} from "@chakra-ui/react";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {Fragment} from "react";
import ComponentListElement from "./ComponentListElement";
import styled from "@emotion/styled";

const Clone = styled(ListItem)`
  margin-bottom: 12px;

  + li {
    display: none !important;
    background-color: blueviolet;
  }
`;

const ComponentTab = (props) => {
  return (
          <VStack alignItems="flex-start" pt={2}>
              <Text color="gray.400" fontWeight="semibold">All Components</Text>
              <Droppable droppableId="componentList" isDropDisabled={true}
                         type="component">
                  {(provided) => (
                      <UnorderedList
                          listStyleType="none"
                          ref={provided.innerRef}
                      >
                          {props.finalComponentList.map(({id, title, content, icon}, index) => {
                                  return (
                                      <Draggable
                                          key={id}
                                          draggableId={id}
                                          index={index}>
                                          {(provided, snapshot) => (
                                              <Fragment>
                                                  <ListItem
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      mb={3}
                                                  >
                                                      <ComponentListElement title={title}
                                                                            content={content}
                                                                            icon={icon}/>
                                                  </ListItem>
                                                  {snapshot.isDragging &&
                                                      <Clone>
                                                          <ComponentListElement title={title}
                                                                                content={content}
                                                                                icon={icon}/>
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
          </VStack>
  )
}
export default ComponentTab;