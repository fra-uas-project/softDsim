import {HStack, Icon, Text, VStack} from "@chakra-ui/react";
import {HiCheckCircle, HiExclamationCircle} from "react-icons/hi";
import React from "react";
import {validationErrorColors, validationErrorTypes} from "../scenarioValidation";


const ValidationOverview = (props) => {

    const iconColor = () => {
        if (props.validationErrors.some(error => error.type === validationErrorTypes.ERROR)) {
            return `${validationErrorColors.ERROR}.500`
        } else if (props.validationErrors.some(error => error.type === validationErrorTypes.WARNING)) {
            return `${validationErrorColors.WARNING}.500`
        } else if (props.validationErrors.some(error => error.type === validationErrorTypes.INFO)) {
            return `${validationErrorColors.INFO}.500`
        } else {
            return `green.500`
        }
    }

    const overviewContent = () => {
        if (props.validationErrors.some(error => error.type === validationErrorTypes.ERROR)) {
            return "errors"
        } else if (props.validationErrors.some(error => error.type === validationErrorTypes.WARNING)) {
            return "warnings"
        } else if (props.validationErrors.some(error => error.type === validationErrorTypes.INFO)) {
            return "tips"
        } else {
            return ""
        }
    }

    const scenarioIsValid = () => {
        return !props.validationErrors.some(error => error.type === validationErrorTypes.ERROR) &&
            !props.validationErrors.some(error => error.type === validationErrorTypes.INTERNAL_ERROR);
    }

    return <>
        <VStack borderRadius="lg" border="1px dashed" borderColor="gray.200" w="full" p={3}>
            <HStack justifyContent="start" alignItems="start">
                <VStack alignItems="start">
                    {scenarioIsValid() && <HStack>
                        <Icon as={HiCheckCircle} w={5} h={5} color="green.500"/>
                        <Text fontSize="sm" fontWeight="500" color="gray.400">
                            Congratulations. Scenario is valid.
                        </Text>
                    </HStack>
                    }
                    {props.validationErrors.length ?
                        <HStack>
                            <Icon as={HiExclamationCircle} w={5} h={5} color={iconColor}/>
                            <Text fontSize="sm" fontWeight="500" color="gray.400" wordBreak="break-word">
                                There are {overviewContent()}. Review <span
                                color="black">{props.validationErrors.length}</span> actions below.
                            </Text>
                        </HStack>
                        :
                        <></>
                    }
                </VStack>
            </HStack>
        </VStack>
    </>
};

export default ValidationOverview;