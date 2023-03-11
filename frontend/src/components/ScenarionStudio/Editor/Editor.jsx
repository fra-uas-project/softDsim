import {Droppable} from "react-beautiful-dnd";
import {Flex, Heading, Icon, Text, UnorderedList, VStack} from "@chakra-ui/react";
import {componentEnum} from "../scenarioStudioData";
import EditorBaseComponent from "./EditorBaseComponent";
import EditorListComponent from "./EditorListComponent";
import {RiDragDropLine} from "react-icons/ri";
import React from "react";

const Editor = ({selectedObject, editorList, handleSelect}) => {

    return (
        <Flex maxH="full" w="full" h="full" justifyContent="center" alignItems="center" backgroundColor="white"
              borderRadius="2xl" overflowX="auto" p={10}>
            <Droppable droppableId="editor"
                       type="component"
            >
                {(provided, snapshot) => (
                    <UnorderedList listStyleType="none"
                                   m={0}
                                   mt="auto"
                                   transition="background-color 0.2s ease"
                                   minH="full"
                                   height="auto"
                                   minW="90%"
                                   {...provided.droppableProps}
                                   ref={provided.innerRef}
                                   backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}
                                   display="flex"
                                   flexDir="column"
                                   justifyContent={editorList.length ? "flex-start" : "center"}
                                   alignItems="center"
                                   borderRadius="2xl"
                                   flexGrow="1"
                                   elementid="backgroundList"
                    >
                        {
                            editorList.length ?
                                editorList.map((component, index) => {
                                        if (component.type === componentEnum.BASE) {
                                            return (
                                                <EditorBaseComponent
                                                    key={component.id}
                                                    onClick={((e) => handleSelect(e))}
                                                    index={index}
                                                    component={component}
                                                    isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                />
                                            )
                                        } else if (component.type === componentEnum.FRAGMENT) {
                                            return (
                                                <EditorListComponent
                                                    key={component.id}
                                                    elementid={component.id}
                                                    onClick={((e) => handleSelect(e))}
                                                    id={component.id}
                                                    index={index}
                                                    component={component}
                                                    droppableType="action"
                                                    isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                    selectedItem={selectedObject?.id}
                                                    actions={component.actions}
                                                />
                                            )
                                        } else if (component.type === componentEnum.QUESTIONS) {
                                            return (
                                                <EditorListComponent
                                                    key={component.id}
                                                    elementid={component.id}
                                                    onClick={((e) => handleSelect(e))}
                                                    id={component.id}
                                                    title={component.title}
                                                    index={index}
                                                    component={component}
                                                    droppableType="question"
                                                    isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                    selectedItem={selectedObject?.id}
                                                    actions={component.questions}
                                                />
                                            )
                                        } else if (component.type === componentEnum.EVENT) {
                                            return (
                                                <EditorBaseComponent
                                                    key={component.id}
                                                    onClick={((e) => handleSelect(e))}
                                                    index={index}
                                                    component={component}
                                                    isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                />
                                            )
                                        } else {
                                            return (
                                                <EditorBaseComponent
                                                    key={component.id}
                                                    onClick={((e) => handleSelect(e))}
                                                    index={index}
                                                    component={component}
                                                    isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                />
                                            )
                                        }
                                    }
                                )
                                :
                                <VStack color="gray.200">
                                    <Icon as={RiDragDropLine} w={20} h={20} mb={6}/>
                                    <Heading size="lg" pointerEvents="none">Drag a component
                                        here</Heading>
                                    <Text pointerEvents="none" fontSize="xl" mt="20px">Create a
                                        complex
                                        scenario by drag and dropping different components</Text>
                                </VStack>
                        }
                        {provided.placeholder}
                    </UnorderedList>
                )}
            </Droppable>
        </Flex>
    )
}
export default Editor;