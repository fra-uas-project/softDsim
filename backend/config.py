from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseSettings, Field
from pymongo import MongoClient

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
    mongo_name: str
    mongo_host: str = Field(..., env='MONGO_HOST')
    mongo_port: int
    mongo_user: str
    mongo_pass: str
    server: Optional[int] = 0
    logging_level: Optional[str] = "INFO"

    def get_mongo_client(self) -> MongoClient:
        config = Configuration()
        client = MongoClient(
            host=config.mongo_host,
            port=config.mongo_port,
            username=config.mongo_user,
            password=config.mongo_pass)
        return client

    def get_mongodb(self):
        config = Configuration()
        client = self.get_mongo_client()
        return client[config.mongo_name]

    def get_mongo_db_scenario_template_collection(self):
        mongodb = self.get_mongodb()
        return mongodb["scenario_templates"]


def get_config() -> Configuration:
    """This function should be used to create a Configuration object.
    A configuration object stores all the required variables to
    connect to the mongoDB.

    Returns:
        Configuration: Instance of Configuration class
    """
    load_dotenv("backend/.env")
    return Configuration()
