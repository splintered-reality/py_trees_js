#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################

"""PyTrees javascript libraries and development/demo qt-js hybrid viewer."""

##############################################################################
# Tests
#
# TODO: Disable ignore on script_runner: pytest_console_scripts.ScriptRunner
#
# Q: Are all pytest plugins undiscoverable by mypy?
##############################################################################

# The venv tox creates isn't sufficent for qwebengine's opengl requirements.
# def test_launch(script_runner) -> None:  # type: ignore[no-untyped-def]
#     ret = script_runner.run("py-trees-demo-viewer")
#     assert ret.success


def test_launch() -> None:
    assert True
