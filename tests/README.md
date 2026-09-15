# Tests

## Setup

Install [`uv`](https://docs.astral.sh/uv/).

Then run `uv sync` from the root folder of the package.

## Local Usage

```
# No stdout
$ uv run pytest

# With stdout
$ uv run pytest -s

# With coverage
$ uv run pytest --cov=py_trees_js tests/
```

or inside the activated environment

```
$ source .venv/bin/activate
(.venv) $ cd tests && pytest -s
(.venv) $ deactivate
```
