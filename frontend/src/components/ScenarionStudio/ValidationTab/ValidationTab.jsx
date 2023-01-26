import {Button, Flex, Text, UnorderedList, VStack} from "@chakra-ui/react";
import React from "react";
import {HiFire, HiLightBulb, HiLightningBolt} from "react-icons/hi";
import ValidationItem from "./ValidationItem";
import {validationErrorColors, validationErrorTypes} from "../scenarioValidation";
import InspectorEmtpy from "../InspectorTab/InspectorEmtpy";
import ValidationOverview from "./ValidationOverview";
import {tabIndexEnum} from "../scenarioStudioData";

const ValidationTab = (props) => {

    const createHandleSelectObject = (error) => {
        let componentId = ""
        if(error.params.component.parentId) {
            // Handle question answers
            componentId = error.params.component.parentId
        } else {
            componentId = error.params.component.id
        }

        return {currentTarget: {getAttribute: () => {return componentId}}}
    }

    return (
        <VStack alignItems="flex-start" pt={2} height="full" overflowY="auto" pr={4}>
            {props.validationEnabled ?<>
            <ValidationOverview validationErrors={props.validationErrors} validationEnabled={props.validationEnabled} />
            <Text color="gray.400" fontWeight="semibold">Errors</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.some(error => error.type === validationErrorTypes.ERROR) ?
                    props.validationErrors.filter(error => error.type === validationErrorTypes.ERROR).map((error, index) => {
                    return (
                        <ValidationItem key={index}
                                        componentIcon={error.params.component.icon}
                                        buttonIcon={HiFire}
                                        buttonColor={validationErrorColors.ERROR}
                                        tooltip="Action required"
                                        title={error.params.component.displayName}
                                        description={error.message}
                                        onClick={() => {
                                            if(error.path === "") {
                                                // Handle scenario errors
                                                props.setTabIndex(tabIndexEnum.COMPONENTS)
                                            } else {
                                                props.handleSelect(createHandleSelectObject(error));
                                            }
                                        }}
                        />
                    )
                    })
                    : <InspectorEmtpy content="No actions required."/>
                }
            </UnorderedList>

            <Text color="gray.400" fontWeight="semibold">Warnings</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.some(error => error.type === validationErrorTypes.WARNING) ?
                        props.validationErrors.filter(error => error.type === validationErrorTypes.WARNING).map((error, index) => {
                            return (
                                <ValidationItem key={index}
                                                componentIcon={error.params.component.icon}
                                                buttonIcon={HiLightningBolt}
                                                buttonColor={validationErrorColors.WARNING}
                                                tooltip="Action recommended"
                                                title={error.params.component.displayName}
                                                description={error.message}
                                                onClick={() => props.handleSelect(createHandleSelectObject(error))}
                                />
                            )
                        })
                        : <InspectorEmtpy content="No actions required."/>
                }
            </UnorderedList>

            <Text color="gray.400" fontWeight="semibold">Tips</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.some(error => error.type === validationErrorTypes.INFO) ?
                    props.validationErrors.filter(error => error.type === validationErrorTypes.INFO).map((error, index) => {
                        return (
                            <ValidationItem key={index}
                                            componentIcon={error.params.component.icon}
                                            buttonIcon={HiLightBulb}
                                            buttonColor={validationErrorColors.INFO}
                                            tooltip="Action possible"
                                            title={error.params.component.displayName}
                                            description={error.message}
                                            onClick={() => {
                                                props.handleSelect(createHandleSelectObject(error));
                                            }}
                            />
                        )
                    })
                    : <InspectorEmtpy content="No actions required."/>
                }
            </UnorderedList>
            </> : <InspectorEmtpy content="Enable validation to uncover errors, warnings and receive tips."/>}
            <Flex w="full" pt={2} pb={4} justifyContent="center">
                <Button size="sm" onClick={() => {props.setValidationEnabled(!props.validationEnabled)}}>
                    {props.validationEnabled ? "Disable" : "Enable" } Validation
                </Button>
            </Flex>

        </VStack>
    )
}
export default ValidationTab;