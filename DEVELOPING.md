# Developing

[[Setup](#setup)] [[Test-Format-Lint](#test-format-lint)] [[Packaging](#packaging)]

This project uses

* [`uv`](https://docs.astral.sh/uv/) for environment and dependency management
* [`ruff`](https://docs.astral.sh/ruff/) for formatting & linting

## Setup

Install [uv](https://docs.astral.sh/uv/getting-started/installation/).
Then, sync the project.
This creates a `.venv` with all dev dependencies:

```
$ uv sync
```

That's it - prefix commands with `uv run` to execute them inside the environment,
or activate it with `source .venv/bin/activate`.

Running the demo viewer additionally needs the Qt WebEngine / OpenGL system
libraries, see `.devcontainer/Dockerfile` for the list of debs.

## Test-Format-Lint

```
# Auto-format your code (install the 'charliermarsh.ruff' extension for VSCode)
$ uv run ruff format

# Lint
$ uv run ruff check          # add --fix to auto-fix

# Tests
$ uv run pytest -s tests/
$ uv run pytest --cov=py_trees_js tests/   # with coverage
```

CI runs the tests against python 3.10, 3.12, and 3.14.
To test against a specific version locally, pass `--python`, e.g. `uv run --python 3.12 pytest -s tests/`.

## Packaging

```
# Build the sdist & wheel into ./dist
$ uv build

# Publish to PyPI manually (requires credentials, e.g. UV_PUBLISH_TOKEN)
$ uv publish
```

Releases are normally published by CI instead: pushing a tag of the form `x.y.z`
(e.g. `0.6.7`) runs `.github/workflows/publish.yaml`, which checks that the tag
matches the version in `pyproject.toml`, builds the distributions and uploads them
to PyPI via trusted publishing (no token needed).
