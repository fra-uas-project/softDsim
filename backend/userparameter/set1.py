from app.dto.request import Workpack
from userparameter.factory import UserParameter


USERPARAMETERS = [
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=False,
        meetings=20,
        training=5,
        teamevent=False,
        salary=0,
        overtime=2,
    ),
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=False,
        meetings=20,
        training=5,
        teamevent=False,
        salary=0,
        overtime=0,
    ),
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=False,
        meetings=0,
        training=0,
        teamevent=False,
        salary=0,
        overtime=1,
    ),
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=False,
        meetings=2,
        training=1,
        teamevent=False,
        salary=0,
        overtime=1,
    ),
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=True,
        meetings=2,
        training=1,
        teamevent=False,
        salary=0,
        overtime=1,
    ),
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=True,
        meetings=5,
        training=0,
        teamevent=True,
        salary=2,
        overtime=1,
    ),
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=False,
        meetings=0,
        training=0,
        teamevent=True,
        salary=0,
        overtime=2,
    ),
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=False,
        meetings=15,
        training=5,
        teamevent=False,
        salary=2,
        overtime=1,
    ),
]
