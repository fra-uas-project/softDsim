#!/bin/bash

# Collect static files
# echo "Collect static files"
# python /home/app/webapp/manage.py collectstatic --noinput

# echo "Create new Migrations"
# python /home/app/webapp/manage.py makemigrations

# Apply database migrations
echo "Apply database migrations"
python /home/app/webapp/manage.py migrate

# Start server
echo "Starting server"
python /home/app/webapp/manage.py runserver 0.0.0.0:8000
