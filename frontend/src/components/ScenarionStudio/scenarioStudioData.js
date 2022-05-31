import {
    MdAlarm,
    MdIntegrationInstructions, MdLocalBar, MdMiscellaneousServices, MdOutlineAttachMoney,
    MdOutlineAttractions,
    MdOutlineBugReport, MdOutlineCheckBox,
    MdOutlineInfo, MdOutlineRadioButtonChecked,
    MdRule, MdSchool,
    MdTimeline
} from "react-icons/md";
import {BsLightningCharge} from "react-icons/bs";
import {HiUserGroup} from "react-icons/hi";
import {v4 as uuidv4} from 'uuid';

export const tabIndexEnum = {
    "INSPECTOR": 0,
    "COMPONENTS": 1
};

export const componentEnum = {
    "BASE": "BASE",
    "FRAGMENT": "FRAGMENT",
    "MODELSELECTION": "MODELSELECTION",
    "QUESTIONS": "QUESTIONS",
    "EVENT": "EVENT"
}

export const questionEnum = {
    "SINGLE": "SINGLE",
    "MULTI": "MULTI",
}

export const finalComponentList = [
    {
        id: uuidv4(),
        type: "BASE",
        title: "Simulation Base Information",
        content: "Define the basic stats for a new simulation.",
        icon: MdOutlineInfo,
        displayName: "Base Information",
        template_name: `Scenario ${uuidv4().slice(0, 8)}`,
        text: "",
        budget: "0",
        duration: "0",
        easy_tasks: "0",
        medium_tasks: "0",
        hard_tasks: "0",
    },
    {
        id: uuidv4(),
        type: "FRAGMENT",
        title: "Simulation Fragment",
        content: "Control the simulation by defining fragments.",
        icon: MdTimeline,
        displayName: `Simulation ${uuidv4().slice(0, 8)}`,
        actions: [],
        simulation_end: {}
    },
    {
        id: uuidv4(),
        type: "MODELSELECTION",
        title: "Model Selection",
        content: "Change between different project management methods.",
        icon: BsLightningCharge,
        displayName: "Model Selection",
        text: "",
        models: [],
    },
    {
        id: uuidv4(),
        type: "QUESTIONS",
        title: "Questions",
        content: "Create questions which need to be answered.",
        icon: MdRule,
        displayName: `Questions ${uuidv4().slice(0, 8)}`,
        text: "",
        questions: [],

    },
    {
        id: uuidv4(),
        type: "EVENT",
        title: "Event",
        displayName: `Event ${uuidv4().slice(0, 8)}`,
        content: "Add events that have an impact on the management objectives.",
        text: "",
        icon: MdOutlineAttractions,
        trigger: {},
        budget: "0",
        duration: "0",
        easy_tasks: "0",
        medium_tasks: "0",
        hard_tasks: "0",
        stress: "0",
        motivation: "0"
    },
]

export const finalActionList = [
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Bug Fixing",
        icon: MdOutlineBugReport,
        displayName: "Bug Fixing",
        action: "bugfix",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Unit Testing",
        icon: MdIntegrationInstructions,
        displayName: "Unit Testing",
        action: "unittest",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Integration Testing",
        icon: MdMiscellaneousServices,
        displayName: "Integration Testing",
        action: "integrationtest",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Meetings",
        icon: HiUserGroup,
        displayName: "Meetings",
        action: "meetings",
        lower_limit: "0",
        upper_limit: "1",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Team Event",
        icon: MdLocalBar,
        displayName: "Team Event",
        action: "teamevent",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Training",
        icon: MdSchool,
        displayName: "Training",
        action: "training",
        lower_limit: "0",
        upper_limit: "1",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Salary",
        icon: MdOutlineAttachMoney,
        displayName: "Salary",
        action: "salary",
    },
    {
        id: uuidv4(),
        type: "ACTION",
        title: "Overtime",
        icon: MdAlarm,
        displayName: "Overtime",
        action: "overtime",
    },
];

export const finalQuestionList = [
    {
        id: uuidv4(),
        type: "SINGLE",
        title: "Single Answer",
        icon: MdOutlineRadioButtonChecked,
        displayName: `Question ${uuidv4().slice(0, 8)}`,
        text: "",
        answers: []
    },
    {
        id: uuidv4(),
        type: "MULTI",
        title: "Multiple Answers",
        icon: MdOutlineCheckBox,
        displayName: `Question ${uuidv4().slice(0, 8)}`,
        text: "",
        answers: []
    },
];