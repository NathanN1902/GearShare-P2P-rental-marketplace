FROM python:3.12.3

WORKDIR /app

COPY requirements.txt ./

ARG EXPECTED_PYTHON_VERSION="3.12.3"

RUN pip install -r requirements.txt

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]