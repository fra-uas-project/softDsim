import { Stack, Button } from "@chakra-ui/react"
import { useState } from "react"
import { GiWaterfall } from "react-icons/gi"
import { DiScrum } from "react-icons/di"
import { BsKanbanFill } from "react-icons/bs"

const ModelSelection = (props) => {
    // selected option will be highlighted
    const [selectedOption, setSelectedOption] = useState('')

    function handleSelect(option) {
        setSelectedOption(option)
        props.onSelectModel(option)
    }

    return (
        <Stack>
            {props.models.map((model, index) => {
                return <Button h={40} leftIcon={
                    // get icon for type, if type is not found, no icon will be shown
                    model === 'waterfall' ? <GiWaterfall size={100} /> :
                        model === 'scrum' ? <DiScrum size={140} /> :
                            model === 'kanban' ? <BsKanbanFill size={80} /> : <></>}
                    onClick={() => handleSelect(model)} key={index} fontSize="4xl" colorScheme={selectedOption === model ? 'blue' : 'gray'}>{
                        model.charAt(0).toUpperCase() + model.slice(1)
                    }</Button >
            })}
        </Stack>
    )
}

export default ModelSelection