FROM python:3
ENV PYTHONUNBUFFERED 1
ENV HTTP_PROXY "http://wwwproxy.unimelb.edu.au:8000"
ENV HTTPS_PROXY "http://wwwproxy.unimelb.edu.au:8000"
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/