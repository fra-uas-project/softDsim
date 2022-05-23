from typing import Optional
from pydantic import BaseSettings
from dotenv import load_dotenv


load_dotenv(".env")


class Configuration(BaseSettings):
    """Configuration Management class. This class reads the environment
    variables required for the database connection vom the environment.

    Args:
        No arguments need to be passed to initialize an object of the
        class since it reads the env vars automatically.
    """

    database_name: str
    database_host: str
    database_port: Optional[str]
    database_user: str
    database_pass: str
    cloud_db: Optional[bool]
    logging_level: Optional[str] = "INFO"

    @property
    def mongo_client(self) -> str:
        """Created a string that can be used to connect to the mongodb.

        Returns:
            str: MongoDB client connection str
                 (mongodb://user:pass@host:port/.....)
        """
        protocol = "mongodb"
        if self.cloud_db:
            protocol += "+srv"
        host = self.database_host
        if self.database_port is not None:
            host += f":{self.database_port}"

        # if self.database_user == '':
        #     print('database_user not specified - connecting to database without login credentials')
        #     return f"{protocol}://{host}/?retryWrites=true&w=majority"

        return f"{protocol}://{self.database_user}:{self.database_pass}@{host}/?retryWrites=true&w=majority"


def get_config() -> Configuration:
    """This function should be used to create a Configuration object.
    A configuration object stores all the required variables to
    connect to the mongoDB.

    Returns:
        Configuration: Instance of Configuration class
    """
    return Configuration()
