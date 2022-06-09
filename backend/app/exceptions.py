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


class RequestActionException(BaseException):
    def __init__(self):
        super().__init__("Action was not specified.")


class RequestMembersException(BaseException):
    def __init__(self):
        super().__init__("Members was not specified.")


class SimulationException(BaseException):
    """Raised when simulation cannot be executed because of wrong data in request."""


class RequestTypeMismatchException(BaseException):
    """Raised when request type does not match response type of last step in history."""

    def __init__(self, type):
        super().__init__(f"Request type {type} does not match previous response type.")


class TooManyMeetingsException(BaseException):
    """Raised when user requests more meetings per day than available work hours"""

    def __init__(self, meetings, hours):
        super().__init__(
            f"Requested {meetings} hours of meetings per day, but only {hours} hours are available per day."
        )
