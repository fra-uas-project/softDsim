import { Stack, Button } from "@chakra-ui/react"
import { useState } from "react"
import { GiWaterfall } from "react-icons/gi"
import { DiScrum } from "react-icons/di"
import { BsKanbanFill } from "react-icons/bs"

const ModelSelection = (props) => {
    const [selectedOption, setSelectedOption] = useState('')
    const [options, setOptions] = useState([
        'Waterfall', 'Agile', 'Kanban'
    ])

    function handleSelect(option) {
        setSelectedOption(option)
        props.onSelectModel(option)
    }

    return (
        <Stack>
            {options.map((option, index) => {
                return <Button h={40} leftIcon={
                    option === 'Waterfall' ? <GiWaterfall size={100} /> :
                        option === 'Agile' ? <DiScrum size={140} /> :
                            option === 'Kanban' ? <BsKanbanFill size={80} /> : <></>}
                    onClick={() => handleSelect(option)} key={index} fontSize="4xl" colorScheme={selectedOption === option ? 'blue' : 'gray'}>{option}</Button >
            })}
        </Stack>
    )
}

export default ModelSelection