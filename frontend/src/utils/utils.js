import {componentEnum} from "../components/ScenarionStudio/scenarioStudioData";
import {
    MdAlarm,
    MdIntegrationInstructions, MdLocalBar,
    MdMiscellaneousServices, MdOutlineAttachMoney, MdOutlineAttractions,
    MdOutlineBugReport, MdOutlineCheckBox,
    MdOutlineInfo, MdOutlineRadioButtonChecked, MdRule, MdSchool,
    MdTimeline
} from "react-icons/md";
import {HiUserGroup} from "react-icons/hi";
import {BsLightningCharge} from "react-icons/bs";
import {validationErrorColors, validationErrorTypes} from "../components/ScenarionStudio/scenarioValidation";

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const role = {
    ADMIN: "admin",
    STAFF: "staff",
    CREATOR: "creator",
    STUDENT: "student"
}

export const action = {
    BUGFIX: "bugfix",
    UNITTEST: "unittest",
    INTEGRATIONTEST: "integrationtest",
    TEAMEVENT: "teamevent",
    MEETINGS: "meetings",
    TRAINING: "training",
    SALARY: "salary",
    OVERTIME: "overtime"
}

export const iconMap = {
    MdOutlineInfo: MdOutlineInfo,
    MdTimeline: MdTimeline,
    MdOutlineBugReport: MdOutlineBugReport,
    MdIntegrationInstructions: MdIntegrationInstructions,
    MdMiscellaneousServices: MdMiscellaneousServices,
    HiUserGroup: HiUserGroup,
    MdLocalBar: MdLocalBar,
    MdSchool: MdSchool,
    MdOutlineAttachMoney: MdOutlineAttachMoney,
    MdAlarm: MdAlarm,
    BsLightningCharge: BsLightningCharge,
    MdRule: MdRule,
    MdOutlineRadioButtonChecked: MdOutlineRadioButtonChecked,
    MdOutlineCheckBox: MdOutlineCheckBox,
    MdOutlineAttractions: MdOutlineAttractions
}

export const findQuestion = (questionId, editorList) => {
    const questionsList = editorList.filter(component => component.type === componentEnum.QUESTIONS)

    let questions = []
    for (const questionsListElement of questionsList) {
        questions = [...questions, ...questionsListElement.questions]
    }

    return (questions.find(question => question.id === questionId))
};

export const findAction = (actionId, editorList) => {
    const fragmentList = editorList.filter(component => component.type === componentEnum.FRAGMENT)

    let actions = []
    for (const fragment of fragmentList) {
        actions = [...actions, ...fragment.actions]
    }

    return (actions.find(action => action.id === actionId))
}

export const isError = (validationErrors, componentId, objectKey) => {
    return validationErrors.some(error => error.error.params.component.id === componentId && error.error.path.includes(objectKey))
}

export const getErrorType = (validationErrors, componentId, objectKey) => {
    return validationErrors.filter(error => error.error.params.component.id === componentId && error.error.path.includes(objectKey))[0].error.type
}

export const getErrorMessage = (validationErrors, componentId, objectKey) => {
    return validationErrors.filter(error => error.error.params.component.id === componentId && error.error.path.includes(objectKey))[0].error.message
}

export const getErrorColor = (validationErrors, componentId, objectKey) => {
    if (isError(validationErrors, componentId, objectKey)) {
        const errorType = getErrorType(validationErrors, componentId, objectKey)
        if (errorType === validationErrorTypes.WARNING) {
            return `${validationErrorColors.WARNING}.500`
        } else if (errorType === validationErrorTypes.INFO) {
            return `${validationErrorColors.INFO}.500`
        } else if (errorType === validationErrorTypes.INTERNAL_ERROR) {
            return `${validationErrorColors.INTERNAL_ERROR}.500`
        } else if (errorType === validationErrorTypes.ERROR) {
            return `${validationErrorColors.ERROR}.500`
        } else {
            // default red for unknown
            return undefined
        }
    }
}