import {componentEnum} from "../components/ScenarionStudio/scenarioStudioData";
import {
    MdAlarm,
    MdIntegrationInstructions,
    MdLocalBar,
    MdMiscellaneousServices, MdOutlineAttachMoney,
    MdOutlineBugReport,
    MdSchool
} from "react-icons/md";
import {HiUserGroup} from "react-icons/hi";

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

export const actionIcon = {
    BUGFIX: MdOutlineBugReport,
    UNITTEST: MdIntegrationInstructions,
    INTEGRATIONTEST: MdMiscellaneousServices,
    TEAMEVENT: MdLocalBar,
    MEETINGS: HiUserGroup,
    TRAINING: MdSchool,
    SALARY: MdOutlineAttachMoney,
    OVERTIME: MdAlarm
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