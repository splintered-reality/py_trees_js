# Tests

## Setup

Make sure you run `poetry install` from the root folder of the package.

## Local Usage

```
# No stdout
$ poetry run pytest

# With stdout
$ poetry run pytest -s
```

or in the poetry shell

```
$ poetry shell
(e) $ cd tests && pytest -s
(e) exit
```

## Tox

```
$ tox -e py38      # tests + coverage
$ tox -e format    # formats with ufmt
$ tox -e check     # formatting, linting and mypy checkers
```
