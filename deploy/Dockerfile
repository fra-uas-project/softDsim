FROM python:3.9.12
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /home/app/webapp
# Install requirements
COPY ./ /home/app/webapp/
# RUN apt-get update
# RUN pip install --upgrade pip
RUN pip install -r /home/app/webapp/requirements.txt
# Entrypoint
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
EXPOSE 8000
CMD /entrypoint.sh