import ActionElement from "./ActionElement";
import {actionIcon} from "../../ScenarionStudio/scenarioStudioData";
import {Grid, IconButton} from "@chakra-ui/react";
import {HiOutlineChevronDown, HiOutlineChevronLeft} from "react-icons/hi";
import {useState} from "react";
import Skilltype from "./Skilltype";

const SkilltypeContainer = ({skillTypeReturn, simValues, updateSkillTypeObject}) => {

    const [actionListExpanded, setActionListExpanded] = useState(false);

    const toggleActionList = () => {
        setActionListExpanded(!actionListExpanded)
    }

    function getSkillTypeCount(skill) {
        var skillTypeCount = 0
        for (const type of simValues.members) {
            if (type.skill_type.name === skill) {
                skillTypeCount = skillTypeCount + 1
            }
        }
        return skillTypeCount
    }

    return (
        <Grid borderRadius="xl">
            <ActionElement title="Employees"
                           secondaryText="Hire employees"
                           icon={actionIcon.SKILLTYPE} tooltip={"Choose the necessary amount of the specific skilltype which is needed for the current project"}>
                <IconButton aria-label="Expand and collapse actions"
                            icon={actionListExpanded ? <HiOutlineChevronDown/> : <HiOutlineChevronLeft/>}
                            variant="ghost"
                            size="md"
                            onClick={toggleActionList}
                />
            </ActionElement>
            {actionListExpanded &&
                <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                    {skillTypeReturn.map((skilltype, index) => {
                        return <Skilltype
                            key={index}
                            onUpdateChange={(event) => {updateSkillTypeObject(event.name, event.value)}}
                            skillTypeName={skilltype.skill_type}
                            currentCount={getSkillTypeCount(skilltype.skill_type)}
                            countChange={skilltype.change}/>
                    })}
                </Grid>
            }

        </Grid>
    )
}

export default SkilltypeContainer;