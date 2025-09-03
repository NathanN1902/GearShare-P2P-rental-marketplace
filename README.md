# Project Title: Rental Marketplace

## Group 24

| Student Name | Project Role |
|---|---|
| Nathan | Front-end developer |
| Celine | Back-end developer |
| Kim | Back-end developer |
| Quinton | Front-end developer |

## Housekeeping

### Branch

Ensure master is up to date using `git pull`

Create/switch to branch:

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

### Pull Request

```
git add .
git commit -m "meaningful message"
git push

```

Create PR in GitHub.

## Backend Setup

**<ins>Setting up a virtual environment</ins>**

In terminal: 

```
cd backend

python3 -m venv env

source env/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Deactivate the virtual enviroment:
```
deactivate
```

**<ins>Running backend</ins>**

Navigate to backend directory

Standard:
```
python3 -m app.main
```

Docker compose:
```
docker compose up --build
```

Other:
```
uvicorn main:app --reload
fastapi run app/main.py
```