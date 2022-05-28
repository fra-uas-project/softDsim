class IndexException(BaseException):
    """Raised when TemplateScenario cannot be created because indexes in request are not valid."""

    def __init__(self):
        super().__init__(
            "TemplateScenario NOT saved. Indexes of Scenario components are wrong - Indexes start at 0 and have to be "
            "incremented by 1. "
        )


class RequestTypeException(BaseException):
    """Raised when request JSON is missing the type field."""

    def __init__(self):
        super().__init__(
            "Type of request was not specified. Type has to be one of the following: QUESTION, SIMULATION, MODEL_SELECTION"  # (maybe add more don't know yet)
        )


class SimulationException(BaseException):
    """Raised when simulation cannot be executed because of wrong data in request."""
