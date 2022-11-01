from app.dto.request import Workpack
from userparameter.factory import UserParameter


wps1 = [
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=False,
        meetings=20,
        training=5,
        teamevent=False,
        salary=0,
        overtime=2,
    )
]

UP1 = UserParameter(wps1)


### Set 2

wps2 = [
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=False,
        meetings=5,
        training=0,
        teamevent=False,
        salary=0,
        overtime=1,
    ),
]

UP2 = UserParameter(wps2)


### Set 3

wps3_no_int = [
    Workpack(
        bugfix=True,
        unittest=True,
        integrationtest=False,
        meetings=5,
        training=0,
        teamevent=False,
        salary=0,
        overtime=0,
    ),
]

wps_int = [
    Workpack(
        bugfix=False,
        unittest=False,
        integrationtest=True,
        meetings=0,
        training=0,
        teamevent=False,
        salary=0,
        overtime=0,
    ),
]

UP3 = UserParameter(wps3_no_int * 10 + wps_int + wps3_no_int)

