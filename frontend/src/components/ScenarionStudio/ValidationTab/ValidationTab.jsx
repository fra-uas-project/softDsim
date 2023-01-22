import {Button, HStack, Icon, ListItem, Text, UnorderedList, VStack} from "@chakra-ui/react";
import React from "react";
import {HiExclamationCircle, HiLightBulb, HiLightningBolt, HiOutlineCheck} from "react-icons/hi";
import {Link} from "react-router-dom";
import ValidationItem from "./ValidationItem";
import {validationErrorColors, validationErrorTypes} from "../scenarioValidation";

const ValidationTab = (props) => {

    const createHandleSelectObject = (componentId) => {
        return {currentTarget: {getAttribute: () => {return componentId}}}
    }

    return (
        <VStack alignItems="flex-start" pt={2}>
            <VStack borderRadius="lg" border="1px dashed" borderColor="gray.200" w="full" p={3}>
                <HStack justifyContent="start" alignItems="start">
                    <Icon as={HiExclamationCircle} w={5} h={5} color="red"/>
                    <VStack alignItems="start">
                        <Text fontSize="sm" fontWeight="500" color="gray.400">There's a problem. Review <span
                            color="black">x</span> errors below.</Text>
                        <UnorderedList listStylePos="inside">
                            <ListItem fontSize="sm" fontWeight="500" color="gray.600">
                                <Button fontSize="sm" fontWeight="500" color="gray.600" variant='link' as={Link}
                                        to="/scenario-studio">
                                    First Component
                                </Button>
                            </ListItem>
                            <ListItem fontSize="sm" fontWeight="500" color="gray.600">
                                <Button fontSize="sm" fontWeight="500" color="gray.600" variant='link' as={Link} to="/scenario-studio">
                                    Second Component
                                </Button></ListItem>
                        </UnorderedList>
                    </VStack>
                </HStack>
            </VStack>
            <Text color="gray.400" fontWeight="semibold">Errors</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.filter(error => error.error.type === validationErrorTypes.ERROR).map((error, index) => {
                    return (
                        <ValidationItem key={index}
                                        componentIcon={error.component.icon}
                                        buttonIcon={HiLightningBolt}
                                        buttonColor={validationErrorColors.ERROR}
                                        tooltip="Action required"
                                        title={error.component.displayName}
                                        description={error.error.message}
                                        onClick={() => {
                                            props.handleSelect(createHandleSelectObject(error.component.id));
                                        }}
                        />
                    )
                })
                }
            </UnorderedList>

            <Text color="gray.400" fontWeight="semibold">Warnings</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.filter(error => error.error.type === validationErrorTypes.WARNING).map((error, index) => {
                    return (
                        <ValidationItem key={index}
                                        componentIcon={error.component.icon}
                                        buttonIcon={HiLightBulb}
                                        buttonColor={validationErrorColors.WARNING}
                                        tooltip="Action recommended"
                                        title={error.component.displayName}
                                        description={error.error.message}
                                        onClick={() => props.handleSelect(createHandleSelectObject(error.component.id))}
                        />
                    )
                })
                }
            </UnorderedList>

            <Text color="gray.400" fontWeight="semibold">Information</Text>
            <UnorderedList listStyleType="none" w="full">
                {props.validationErrors.filter(error => error.error.type === validationErrorTypes.INFO).map((error, index) => {
                    return (
                        <ValidationItem key={index}
                                        componentIcon={error.component.icon}
                                        buttonIcon={HiOutlineCheck}
                                        buttonColor={validationErrorColors.INFO}
                                        tooltip="Action possible"
                                        title={error.component.displayName}
                                        description={error.error.message}
                                        onClick={() => {
                                            props.handleSelect(createHandleSelectObject(error.component.id));
                                        }}
                        />
                    )
                })
                }
            </UnorderedList>

        </VStack>
    )
}
export default ValidationTab;