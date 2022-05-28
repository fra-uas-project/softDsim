FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /home/app/webapp
# Install requirements
COPY ./backend/requirements.txt /home/app/webapp/
RUN pip install -r /home/app/webapp/requirements.txt
# Entrypoint
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
EXPOSE 8000
CMD /entrypoint.sh