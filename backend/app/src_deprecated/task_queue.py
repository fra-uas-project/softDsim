from app.src_deprecated.task import Task


class TaskQueue:
    
    def __init__(self, tasks=[]) -> None:
        tasks = [] if tasks is None else tasks
        self.tasks = set([Task(**t) for t in tasks])
    
    def __str__(self):
        """String representation of the Task Queue."""
        txt =   "=== Task Queue ===\n"
        txt += f"Size:        {len(self.tasks)}\n"
        txt += f"Done:        {len(self.get(done=True))}\n"
        txt += f"Unit Tested: {len(self.get(unit_tested=True))}\n"
        txt += f"Int. Tested: {len(self.get(integration_tested=True))}\n"
        txt += f"Bug:         {len(self.get(bug=True))}\n"
        txt += f"Spec. T/F:   {len(self.get(correct_specification=True))}/{len(self.get(correct_specification=False))}\n"
        return txt 
    
    def __len__(self):
        return len(self.tasks)
    
    def get(self, n:int=None, **kwargs) -> set[Task]:
        """Get is used go get a set of tasks from the task queue. If no arguments are passed, all tasks are returned. 
        As keyword-arguments, any fields of the task class can be passed to filter only for tasks with the given value for the given field.
        Attention: all filters are AND combined.

        Args:
            n (int, optional): The maximum number of tasks to return. Defaults to None, meaning no upper boundary.
        
        Examples: 
            To get all tasks that are still todo:
                tq.get(done=False)
            To get 21 tasks that are done but not yet unit tested:
                tq.get(done=True, unit_tested=False, n=21)
            To get all tasks that are either hard or have a bug, two queries are required, since all kwargs are AND combined:
                hard_or_bug = tq.get(difficulty=Difficulty.HARD) | tq.get(bug=True)
        

        Returns:
            set[Task]: The set of tasks where the given filters apply.
        """
        filtered =  {t for t in self.tasks if t.filter(**kwargs)}
        if not n is None and n < len(filtered):
            filtered = set(list(filtered)[:n])
        return filtered
    
    def size(self, **kwargs) -> int:
        """Returns the number of tasks with the given properties.
        As keyword-arguments, any fields of the task class can be passed to filter only for tasks with the given value for the given field.
        Attention: all filters are AND combined.
        """
        return len({t for t in self.tasks if t.filter(**kwargs)})


    def add(self, t) -> None:
        """Adds a task or multiple tasks to the queue.

        Args:
            t (Tasks or List[Task] or Set[Task]): Task Object(s) to be added.

        Raises:
            TypeError: If t is neither a Task or list/set of tasks.
        """
        if t is None:
            return
        if isinstance(t, Task):
            self.tasks.add(t)
        elif isinstance(t, set) or isinstance(t, list):
            for task in t: 
                self.add(task)
        else:
            raise TypeError(f"t must be of type Task or must be a set/list of objects of type Task not {type(t)}")
    
    @property
    def json(self):
        """Returns a json (dict) representation of the task queue."""
        return {'tasks': [t.json for t in self.tasks]}
    
    def reset_cascade(self, task: Task):
        """Performs a reset cascade on the given task. The given task, as well as all tasks that depend on this task, will be rested."""
        tasks_to_reset = set()
        tasks_to_reset.add(task)

        d = True
        while d:
            d = False
            for t in self.tasks:
                if t.pred in {ta.id for ta in tasks_to_reset} and t not in tasks_to_reset:
                    tasks_to_reset.add(t)
                    d = True
        for task in tasks_to_reset:
            task.reset()


    # Methods to get stats without calling the get function, because you can't pass arguments from django-html.
    def false_spec(self) -> int:
        return (len(self.get(correct_specification=False)))
    
    def bugs(self) -> int:
        return (len(self.get(bug=True)))
    
    def deploy(self) -> int:
        return (len(self.get(done=True, unit_tested=True, integration_tested=True, bug=False, correct_specification=True)))

    def total(self) -> int:
        return len(self.tasks)
    
    def not_done(self) -> int:
        return len(self.get(done=False))

    