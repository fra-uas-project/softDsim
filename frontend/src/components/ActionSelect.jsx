import { Select } from "@chakra-ui/react"

const ActionSelect = (props) => {
    return (
        <Select bg="white" shadow="md" placeholder={props.selectionText}>
            {props.selection.map((value, index) => {
                return <option key={index} value={value}>{value}</option>
            })}
        </Select>
    )

}

export default ActionSelect