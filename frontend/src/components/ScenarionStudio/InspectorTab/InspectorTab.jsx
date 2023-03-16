import {VStack} from "@chakra-ui/react";
import {actionEnum, componentEnum, finalActionList, finalQuestionList, questionEnum} from "../scenarioStudioData";
import BaseInspectorForm from "./BaseInspectorForm";
import QuestionsInspectorForm from "./QuestionsInspectorForm";
import FragmentInspectorForm from "./FragmentInspectorForm";
import EventInspectorForm from "./EventInspectorForm";
import ModelSelectionInspectorForm from "./ModelSelectionInspectorForm";
import ActionInspectorForm from "./ActionInspectorForm";
import QuestionInspectorForm from "./QuestionInspectorForm";
import InspectorEmtpy from "./InspectorEmtpy";
import React from "react";

const InspectorTab = ({selectedObject, updateEditorList, setSelectedObjectId, validationErrors}) => {

    return (
        <>
            {selectedObject ?
                <VStack alignItems="flex-start" pt={2} maxH="full" h="full">
                    {selectedObject?.type === componentEnum.BASE &&
                        <BaseInspectorForm
                            key={selectedObject.id}
                            baseData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params?.component?.type === componentEnum.BASE)}
                        />
                    }

                    {selectedObject?.type === componentEnum.QUESTIONS &&
                        <QuestionsInspectorForm
                            key={selectedObject.id}
                            finalQuestionList={finalQuestionList}
                            questionsData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params?.component?.type === componentEnum.QUESTIONS)}
                        />
                    }

                    {selectedObject?.type === componentEnum.FRAGMENT &&
                        <FragmentInspectorForm
                            key={selectedObject.id}
                            finalActionList={finalActionList}
                            fragmentData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params?.component?.type === componentEnum.FRAGMENT)}
                        />
                    }

                    {selectedObject?.type === componentEnum.EVENT &&
                        <EventInspectorForm
                            key={selectedObject.id}
                            eventData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.EVENT)}
                        />
                    }

                    {selectedObject?.type === componentEnum.MODELSELECTION &&
                        <ModelSelectionInspectorForm
                            key={selectedObject.id}
                            modelSelectionData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.MODELSELECTION)}
                        />
                    }

                    {selectedObject?.type === "ACTION" &&
                        <ActionInspectorForm
                            key={selectedObject.id}
                            actionData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(error => error.params.component.type === actionEnum.ACTION)}
                        />
                    }

                    {(selectedObject?.type === questionEnum.SINGLE || selectedObject?.type === questionEnum.MULTI) &&
                        <QuestionInspectorForm
                            /* key = answers to trigger rerender on answer change*/
                            key={selectedObject.answers + selectedObject.id}
                            questionData={selectedObject}
                            updateEditorList={updateEditorList}
                            setSelectedObject={setSelectedObjectId}
                            validationErrors={validationErrors.filter(
                                error => error.params.component.type === questionEnum.SINGLE ||
                                    error.params.component.type === questionEnum.MULTI ||
                                    error.params.component.type === "ANSWER"
                            )}
                        />
                    }
                </VStack>
                :
                <InspectorEmtpy
                    content="No components selected. Click on a component to select it."
                />
            }
        </>
    )
}

export default InspectorTab;