# 2025SIS_Group24

### Project Title: Rental Marketplace

## Project Group 24

| Student Name | Project Role |
|---|---|
| Nathan | Front-end developer |
| Celine | Back-end developer |
| Kim | Back-end developer |
| Quinton | Front-end developer |

## Feature Branch Housekeeping

### <ins>Creating and pushing to branch<\ins>

Navigate to the root directory (2025SIS_Group24).

Ensure that your master is up to date by pulling changes from upstream.

```
git pull
```

Create and switch to branch in terminal:

```
git checkout -b branch-name
```

Quick table for commands:

| Action | Command line |
| --- | --- |
| Check if you're in the branch | `git branch` |
| Pushing branch to repository (for the first time) | `git push -u origin <branch-name>` |
| Pushing to repository (now that branch is available in repo) | `git push origin <branch-name>` |
| Deleting a branch (only when necessary) | `git branch -d <branch-name>` |


## Backend Setup

### <ins>Setting up a virtual environment</ins>

Move terminal to backend directory `cd backend`

In the project directory, execute the following commands in terminal: 

```
cd backend

python3 -m venv env

source env/bin/activate
```

Replace `env` with what you intend to name your virtual environment. 
Recommend to keep `env` to align with .gitignore file.

**Install the required dependencies after you've created and are in the virual environment**

```
pip install -r requirements.txt
```

To deactivate the virtual enviroment, execute `deactivate` in the terminal while in the backend directory. 

### <ins>Running the FastAPI app</ins>

Navigate to the backend/app directory. 

Using uvicorn:
```
uvicorn main:app --reload
```

Using fastAPI:
```
fastapi run main.py
```



