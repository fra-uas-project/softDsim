from enum import Enum
from bson.objectid import ObjectId


class Task:
    def __init__(self, id=None, difficulty=None, done: bool = False, bug: bool = False, correct_specification: bool = True, done_by=None, pred=None, unit_tested=False, integration_tested=False) -> None:
        """A task is a unit of work that is to solve by the team to finish the scenario.

        Args:
            id (ObjectId, optional): Identification number.
            difficulty (Difficulty enum or int 1-3, optional): Difficulty of the task. Defaults to Difficulty.EASY.
            done (bool, optional): True if task was solved. Defaults to False.
            bug (bool, optional): True if solved task has a bug (leads to error in unittest). Defaults to False.
            correct_specification (bool, optional): True if specification is correct (leads to positive integration test). Defaults to True.
            done_by (ObjectId, optional): ID of the member that solved the task. Defaults to None.
            pred (ObjectId, optional): ID of the task that this task builds directly on (if integration test of pred fails, this task's integration test fails as well.). Defaults to None.
        """

        self.id = ObjectId() if id is None else id if isinstance(
            id, ObjectId) else ObjectId(id)
        self.difficulty = difficulty if isinstance(difficulty, Difficulty) else Difficulty(int(
            difficulty)) if isinstance(difficulty, int) or isinstance(difficulty, str) else Difficulty(1)
        self.done = done
        self.bug = bug
        self.correct_specification = correct_specification
        self.unit_tested = unit_tested
        self.integration_tested = integration_tested
        self.done_by = done_by if done_by is None or isinstance(
            done_by, ObjectId) else ObjectId(done_by)
        self.pred = pred if pred is None or isinstance(
            pred, ObjectId) else ObjectId(pred)

    @property
    def json(self):
        """Returns a json (dict) representation of the task object."""
        j = {
            'id': str(self.id),
            'difficulty': self.difficulty.value,
            'done': self.done,
            'bug': self.bug,
            'correct_specification': self.correct_specification,
            'unit_tested': self.unit_tested,
            'integration_tested': self.integration_tested
        }
        if self.done_by is not None:
            j['done_by'] = str(self.done_by)
        if self.pred is not None:
            j['pred'] = str(self.pred)

        return j
 
    def filter(self, **kwargs):
        """Checks if a tasks falls within given filters

        Kwargs can be any subset of the attribtues that task object has (id, difficulty, done, bug...)

        
        >>> task = Task(difficulty=Difficulty.HARD, done=True, bug=True)
        >>> task.filter(difficulty=Difficulty.HARD, done=True) --> True
        >>> task.filter(difficulty=Difficulty.HARD, done=False) --> False
        >>> task.filter(bug=False) --> False
        >>> task.filter(bug=True) --> True
        
        Returns:
            bool: True if task has all given attributes as specified. Else False.
        """
        for key, val in kwargs.items():
            if self.__dict__.get(key) != val:
                return False
        return True
    
    def reset(self):
        self.bug = False
        self.done = False
        self.done_by = None
        self.integration_tested = False
        self.unit_tested = False
        self.pred = None


class Difficulty(Enum):
    """Difficulty level of a task."""
    EASY = 1
    MEDIUM = 2
    HARD = 3
