import * as yup from "yup"
import {componentEnum} from "./scenarioStudioData";

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
    INFO: "green"
}

// export const editorListSchema = yup.array().of(yup.object().shape({
//     type: yup.string().required().test(validationErrorTypes.INTERNAL_ERROR, "Invalid component type", value => Object.values(componentEnum).includes(value))
// }));

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
            return yup.mixed().test(validationErrorTypes.INTERNAL_ERROR, "Invalid component type", value => false)
    }
}))

// Validating internal fields which are not set by the user
export const basicSchema = yup.object().shape({
    id: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    content: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    displayName: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    icon: yup.mixed().test(validationErrorTypes.INTERNAL_ERROR, "Icon must be a function", value => {if (typeof value === "function") return true}),
    title: yup.string().required().label(validationErrorTypes.INTERNAL_ERROR),
    type: yup.string().required().test(validationErrorTypes.INTERNAL_ERROR, "Invalid component type", value => Object.values(componentEnum).includes(value))
})

export const baseSchema = basicSchema.shape({
    template_name: yup.string().test(validationErrorTypes.ERROR, "Scenario name can't be empty", value => value !== ""),
    text: yup.string().test(validationErrorTypes.WARNING, "It is recommended that the story is not empty", value => value !== ""),
    budget: yup.number().required().test(validationErrorTypes.ERROR, "The budget can't be 0", value => value !== 0),
    duration: yup.number().required().test(validationErrorTypes.ERROR, "The duration can't be 0", value => value !== 0),
    easy_tasks: yup.number().required().test(validationErrorTypes.WARNING, "It is not recommended to have 0 easy tasks", value => value !== 0),
    medium_tasks: yup.number().required().test({name: validationErrorTypes.WARNING, message: "It is not recommended to have 0 medium tasks", params: {id: "this.parent.id"}, test: value => value !== 0}),
    hard_tasks: yup.number().required().test(validationErrorTypes.WARNING, "It is not recommended to have 0 hard tasks", value => value !== 0),
}).test(validationErrorTypes.ERROR, "The total number of tasks can't be 0", value => {
    return value.easy_tasks + value.medium_tasks + value.hard_tasks !== 0;
})

export const fragmentSchema = basicSchema.shape({
    text: yup.string().test(validationErrorTypes.WARNING, "It is recommended that the story is not empty", value => {
        if (value) {return true}
    }),
    actions: yup.array().required().test(value => {
        if(value.length === 0) {
            return new yup.ValidationError("Actions should not be empty", value, "actions", validationErrorTypes.ERROR)
        } else if(value.length < 4) {
            return new yup.ValidationError("Low number of actions", value, "actions", validationErrorTypes.WARNING)
        } else {
            return true
        }
    })
//     TODO endCondition
})

export const modelSelectionSchema = basicSchema.shape({
    text: yup.string().test(validationErrorTypes.WARNING, "It is recommended that the story is not empty", value => {
        if (value) {return true}
    }),
    models: yup.array().required().test(validationErrorTypes.ERROR, "Minimum 1 management method required", value => value.length !== 0)
})

export const questionSchema = yup.object().shape({
    text: yup.string().test(validationErrorTypes.ERROR, "Question can't be empty", value => {
        if (value) {return true}
    }),
    answers: yup.array(
        yup.object({
            label: yup.string().test(validationErrorTypes.ERROR, "Answer can't be empty", value => {
                if (value) {return true}
            }),
            points: yup.string().test(validationErrorTypes.WARNING, "0 points have no effect", value => value !== "0")
        })
    )
})

export const questionsSchema = basicSchema.shape({
    text: yup.string().test(validationErrorTypes.WARNING, "It is recommended that the story is not empty", value => {
        if (value) {return true}
    }),
    questions: yup.array(questionSchema).required().test(value => {
        if(value.length === 0) {
            return new yup.ValidationError("Minimum 1 question required", value, "questions", validationErrorTypes.ERROR)
        } else if(value.length === 1) {
            return new yup.ValidationError("Multiple questions can be specified", value, "questions", validationErrorTypes.INFO)
        } else {
            return true
        }
    }),
})

export const eventEffectSchema = yup.object().shape({
    type: yup.string().test(validationErrorTypes.INTERNAL_ERROR, "Type not specified", value => {
        if (value) {return true}
    }),
    value: yup.string().test(validationErrorTypes.WARNING, "Specified impact of 0 has no effect", value => {
        return !(value === "0" || value === "0.00");
    }),
    easy_tasks: yup.string().test(validationErrorTypes.WARNING, "Specified impact of 0 has no effect", value => value !== "0"),
    medium_tasks: yup.string().test(validationErrorTypes.WARNING, "Specified impact of 0 has no effect", value => value !== "0"),
    hard_tasks: yup.string().test(validationErrorTypes.WARNING, "Specified impact of 0 has no effect", value => value !== "0"),

})

export const eventSchema = basicSchema.shape({
    text: yup.string().test(validationErrorTypes.WARNING, "It is recommended that the story is not empty", value => {
        if (value) {return true}
    }),
    trigger_type: yup.string().test(validationErrorTypes.ERROR, "Trigger type must be specified", value => {
        if (value) {return true}
    }),
    trigger_comparator: yup.string().test(validationErrorTypes.ERROR, "Trigger comparator must be specified", value => {
        if (value) {return true}
    }),
    trigger_value: yup.string().test(validationErrorTypes.INTERNAL_ERROR, "Trigger value can't be empty", value => {
        if (value) {return true}
    }),
    effects: yup.array(eventEffectSchema).test(value => {
        if (value.length === 0) {
            return new yup.ValidationError("Minimum 1 impact required", value, "questions", validationErrorTypes.ERROR)
        } else if(value.length === 1) {
            return new yup.ValidationError("Multiple impacts can be specified", value, "questions", validationErrorTypes.INFO)
        } else {
            return true
        }
    })
//     TODO Event will never be reached, because impact is out of scope of base setting
})