import { Divider, Grid, Text } from "@chakra-ui/react"
import ResultElement from "./ResultElement"
import {
    MdOutlineAttachMoney,
    MdCalendarToday,
    MdOutlineLiveHelp,
    MdBuild,
    MdQueryStats,
    MdAccountBalanceWallet,
    MdAccessTime
} from "react-icons/md";

const Result = (props) => {
    console.log('resultParams', props.resultParams)
    return (
        <Grid w="full">
            {/* Question score */}
            <ResultElement title="Question Score" secondaryText="" icon={MdOutlineLiveHelp}>
                <Text fontSize="3xl" color="gray">{props.resultParams.question_score}</Text>
            </ResultElement>
            {/* Budget Score */}
            <ResultElement title="Budget Score" secondaryText="" icon={MdAccountBalanceWallet}>
                <Text fontSize="3xl" color="gray">{props.resultParams.budget_score}%</Text>
            </ResultElement>
            {/* Quality Score */}
            <ResultElement title="Quality Score" secondaryText="" icon={MdBuild}>
                <Text fontSize="3xl" color="gray">{props.resultParams.quality_score}</Text>
            </ResultElement>
            {/* Time Score */}
            <ResultElement title="Time Score" secondaryText="" icon={MdAccessTime}>
                <Text fontSize="3xl" color="gray">{props.resultParams.time_score}%</Text>
            </ResultElement>
            {/* Total Days */}
            <ResultElement title="Total Days" secondaryText="" icon={MdCalendarToday}>
                <Text fontSize="3xl" color="gray">{props.resultParams.total_days}</Text>
            </ResultElement>
            {/* Total Cost */}
            <ResultElement title="Total Cost" secondaryText="" icon={MdOutlineAttachMoney}>
                <Text fontSize="3xl" color="gray">{props.resultParams.total_cost}</Text>
            </ResultElement>
            <Divider />
            {/* Total Score */}
            <ResultElement title="Total Score" secondaryText="" icon={MdQueryStats}>
                <Text fontSize="3xl" color="gray">{props.resultParams.total_score}%</Text>
            </ResultElement>
        </Grid>
    )
}

export default Result