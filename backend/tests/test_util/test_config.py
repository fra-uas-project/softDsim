from config import Configuration, get_config
from dotenv import load_dotenv
import os

load_dotenv(".env")


def test_config_vars_are_read_from_env():
    config = Configuration()

    assert isinstance(config.database_user, str)
    assert len(config.database_user) > 0
    assert config.database_host == os.environ.get("DATABASE_HOST")
    assert config.database_name == os.environ.get("DATABASE_NAME")
    assert config.database_pass == os.environ.get("DATABASE_PASS")
    assert config.database_user == os.environ.get("DATABASE_USER")


def test_get_mongo_connection():
    if os.environ.get("CLOUD_DB") == "True":
        expected = f'mongodb+srv://{os.environ.get("DATABASE_USER")}:{os.environ.get("DATABASE_PASS")}@{os.environ.get("DATABASE_HOST")}/?retryWrites=true&w=majority'    
    expected = f'mongodb://{os.environ.get("DATABASE_USER")}:{os.environ.get("DATABASE_PASS")}@{os.environ.get("DATABASE_HOST")}:{os.environ.get("DATABASE_PORT")}/?retryWrites=true&w=majority'
    config = Configuration()
    assert config.mongo_client == expected


def test_get_config():
    config = get_config()
    assert isinstance(config, Configuration)

    assert config.database_user == os.environ.get("DATABASE_USER")

    os.environ['DATABASE_USER'] = "Peter"
    assert os.environ.get("DATABASE_USER") == "Peter"
    
    config = get_config()
    assert config.database_user == "Peter"
    


def test_no_port():
    del os.environ['DATABASE_PORT']
    os.environ['Cloud_DB'] = "True"
    config = get_config()
    expected = f'mongodb+srv://{os.environ.get("DATABASE_USER")}:{os.environ.get("DATABASE_PASS")}@{os.environ.get("DATABASE_HOST")}/?retryWrites=true&w=majority'
    
    assert config.mongo_client == expected
