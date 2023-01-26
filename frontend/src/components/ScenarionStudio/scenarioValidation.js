import * as yup from "yup"
import {componentEnum} from "./scenarioStudioData";
import {HiExclamation} from "react-icons/hi";

export const validationErrorTypes = {
    INTERNAL_ERROR: "internal-error",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
}

export const validationErrorColors = {
    INTERNAL_ERROR: "purple",
    ERROR: "red",
    WARNING: "yellow",
    INFO: "blue"
}

export const editorListSchema = yup.array().of(yup.lazy(component => {
    switch (component.type) {
        case componentEnum.BASE:
            return baseSchema;
        case componentEnum.FRAGMENT:
            return fragmentSchema;
        case componentEnum.MODELSELECTION:
            return modelSelectionSchema;
        case componentEnum.QUESTIONS:
            return questionsSchema;
        case componentEnum.EVENT:
            return eventSchema;
        default:
            return yup.mixed().test((value, ctx) => {  return ctx.createError({type: validationErrorTypes.INTERNAL_ERROR, message: "Invalid component type", params: {component: ctx.parent}})})
    }
})).test((value, ctx) => {
    if(value.filter(component => component.type === componentEnum.BASE).length === 0) {
        return ctx.createError({
            type: validationErrorTypes.ERROR,
            message: "Base Information required",
            params: {component: {icon: HiExclamation, displayName: "Scenario"}}
        })
    } else {return true} }
).test((value, ctx) => {
    if (value.filter(component => component.type === componentEnum.FRAGMENT).length === 0) {
        return ctx.createError({
            type: validationErrorTypes.ERROR,
            message: "Simulation Fragment required",
            params: {component: {icon: HiExclamation, displayName: "Scenario"}}
        })
    } else { {return true} }
}).test((value, ctx) => {
    const fragments = value.filter(component => component.type === componentEnum.FRAGMENT)
    if (fragments.length > 1) {
        const error = simulationEndValidation(fragments, ctx)
        if(error) {
            return error
        }
    }
    return true
})

// Validating fields which are not the same for all (basic) components
const basicSchema = yup.object().shape({
    id: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    content: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    displayName: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    icon: yup.mixed().test(validationErrorTypes.INTERNAL_ERROR, "Icon must be a function", value => {if (typeof value === "function") return true}),
    title: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    type: yup.string().required().test(validationErrorTypes.INTERNAL_ERROR, "Invalid component type", value => Object.values(componentEnum).includes(value)),
    text: yup.string().test((value, ctx) => { if(!value) { return ctx.createError({type: validationErrorTypes.WARNING, message: "It is recommended that the story is not empty", params: {component: ctx.parent}})} else {return true} }),
})

const baseSchema = basicSchema.shape({
    template_name: yup.string().test((value, ctx) => { if(value === "") { return ctx.createError({type: validationErrorTypes.ERROR, message: "Scenario name can't be empty", params: {component: ctx.parent}})} else {return true} }),
    budget: yup.number().required().test((value, ctx) => { if(value === 0) { return ctx.createError({type: validationErrorTypes.ERROR, message: "The budget can't be 0", params: {component: ctx.parent}})} else {return true} }),
    duration: yup.number().required().test((value, ctx) => { if(value === 0) { return ctx.createError({type: validationErrorTypes.ERROR, message: "The duration can't be 0", params: {component: ctx.parent}})} else {return true} }),
    easy_tasks: yup.number().required().test((value, ctx) => { if(value === 0) { return ctx.createError({type: validationErrorTypes.WARNING, message: "It is not recommended to have 0 easy tasks", params: {component: ctx.parent}})} else {return true} }),
    medium_tasks: yup.number().required().test((value, ctx) => { if(value === 0) { return ctx.createError({type: validationErrorTypes.WARNING, message: "It is not recommended to have 0 medium tasks", params: {component: ctx.parent}})} else {return true} }),
    hard_tasks: yup.number().required().test((value, ctx) => { if(value === 0) { return ctx.createError({type: validationErrorTypes.WARNING, message: "It is not recommended to have 0 hard tasks", params: {component: ctx.parent}})} else {return true} }),
}).test((value, ctx) => { if(value.easy_tasks + value.medium_tasks + value.hard_tasks === 0) {return ctx.createError({type: validationErrorTypes.ERROR, message: "The total number of tasks can't be 0", params: {component: ctx.parent[0]}, path: "empty_tasks"})} else {return true} })

const actionSchema = yup.object().shape({
    // lower_limit: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.INFO, message: "Change default value of lower limit", params: {component: ctx.parent}})} else {return true} }), // deactivated, because lower limit tip could lead to confusion
    upper_limit: yup.string().test((value, ctx) => { if(value === "1") { return ctx.createError({type: validationErrorTypes.INFO, message: "Change default value of upper limit", params: {component: ctx.parent}})} else {return true} }),
})

const fragmentSchema = basicSchema.shape({
    actions: yup.array().required().of(actionSchema).test((value, ctx) => {
        if(value.length === 0) {
            return ctx.createError({type: validationErrorTypes.ERROR, message: "Actions should not be empty", params: {component: ctx.parent}})
        } else if(value.length < 4) {
            return ctx.createError({type: validationErrorTypes.WARNING, message: "Low number of actions", params: {component: ctx.parent}})
        } else {
            return true
        }
    })
//     TODO endCondition
})

const modelSelectionSchema = basicSchema.shape({
    models: yup.array().required().test((value, ctx) => { if (value.length === 0) { return ctx.createError({type: validationErrorTypes.ERROR, message: "Minimum 1 management method required", params: {component: ctx.parent}})} else {return true} })
})

const answerSchema = yup.object().shape({
    label: yup.string().test((value, ctx) => { if(!value) { return ctx.createError({message: "Answer can't be empty", type: validationErrorTypes.ERROR, params: {component: ctx.parent}})} else {return true} }),
    points: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({message: "0 points have no effect", type: validationErrorTypes.WARNING, params: {component: ctx.parent}})} else {return true} }),
})

const questionSchema = yup.object({
    text: yup.string().test((value, ctx) => { if(value === "") { return ctx.createError({type: validationErrorTypes.ERROR, message: "Question can't be empty", params: {component: ctx.parent}})} else {return true} }),
    answers: yup.array().of(answerSchema)
})

const questionsSchema = basicSchema.shape({
    questions: yup.array().required().of(questionSchema).test((value, ctx) => {
        if(value.length === 0) {
            return ctx.createError({message: "Minimum 1 question required", type: validationErrorTypes.ERROR, params: {component: ctx.parent}})
        } else if(value.length === 1) {
            return ctx.createError({message: "Multiple questions can be specified", type: validationErrorTypes.INFO, params: {component: ctx.parent}})
        } else {
            return true
        }
    }),
})

const eventSchema = basicSchema.shape({
    trigger_type: yup.string().test((value, ctx) => { if(value === "") { return ctx.createError({type: validationErrorTypes.ERROR, message: "Trigger type must be specified", params: {component: ctx.parent}})} else {return true} }),
    trigger_comparator: yup.string().test((value, ctx) => { if(value === "") { return ctx.createError({type: validationErrorTypes.ERROR, message: "Trigger comparator must be specified", params: {component: ctx.parent}})} else {return true} }),
    trigger_value: yup.string().test((value, ctx) => {
        if(value === "") {
            return ctx.createError({type: validationErrorTypes.ERROR, message: "Trigger value can't be empty", params: {component: ctx.parent}})
        } else if (value === "0") {
            return ctx.createError({type: validationErrorTypes.WARNING, message: "Trigger with value 0 not recommended", params: {component: ctx.parent}})
        } else {return true} }),
    budget: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Budget of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    duration: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Duration of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    easy_tasks: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Easy tasks of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    medium_tasks: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Medium tasks of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    hard_tasks: yup.string().test((value, ctx) => { if(value === "0") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Hard tasks of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    motivation: yup.string().test((value, ctx) => { if(value === "0.00") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Motivation of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    stress: yup.string().test((value, ctx) => { if(value === "0.00") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Stress of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
    familiarity: yup.string().test((value, ctx) => { if(value === "0.00") { return ctx.createError({type: validationErrorTypes.WARNING, message: "Familiarity of 0 has no impact", params: {component: ctx.parent}})} else {return true} }),
//     TODO Event will never be reached, because impact is out of scope of base setting
}).test((value, ctx) => {
    if(value.budget === "" &&
        value.duration === "" &&
        value.easy_tasks === "" &&
        value.medium_tasks === "" &&
        value.hard_tasks === "" &&
        value.motivation === "" &&
        value.stress === "" &&
        value.familiarity === "" )
    {return ctx.createError({type: validationErrorTypes.ERROR, message: "Minimum 1 impact required", params: {component: ctx.parent[0]}, path: "impact"})} else {return true} })

const simulationEndValidation = (fragments, ctx) => {

    for (let i = 0; i < fragments.length - 1; i++) {
        const currentFragment = fragments[i];

        if (currentFragment.simulation_end.type === "" || currentFragment.simulation_end.limit_type === "" || currentFragment.simulation_end.limit === "") {
            return ctx.createError({type: validationErrorTypes.ERROR, message: "End condition required", params: {component: currentFragment}, path: "fragment.endCondition"})
        }
    }
    return false
}