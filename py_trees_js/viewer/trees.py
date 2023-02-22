#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################

"""Demo trees to feed to the web app."""

##############################################################################
# Imports
##############################################################################

import copy
import typing

##############################################################################
# Methods
##############################################################################


def create_demo_tree_definition():
    """Demo tree."""
    tree = {
        "changed": "true",
        "timestamp": 1563938995,
        "visited_path": ["1", "2", "7"],
        "behaviours": {
            "1": {
                "id": "1",
                "status": "RUNNING",
                "name": "Selector",
                "colour": "#00FFFF",
                "children": ["2", "3", "4", "6"],
                "data": {
                    "Type": "py_trees.composites.Selector",
                    "Feedback": "Decision maker",
                },
            },
            "2": {
                "id": "2",
                "status": "RUNNING",
                "name": "Sequence",
                "colour": "#FFA500",
                "children": ["7", "8", "9"],
                "data": {"Type": "py_trees.composites.Sequence", "Feedback": "Worker"},
            },
            "3": {
                "id": "3",
                "status": "INVALID",
                "name": "Parallel",
                "details": "SuccessOnOne",
                "colour": "#FFFF00",
                "children": ["10", "11"],
                "data": {
                    "Type": "py_trees.composites.Parallel",
                    "Feedback": "Baked beans is good for your heart, baked beans makes you",
                },
            },
            "4": {
                "id": "4",
                "status": "RUNNING",
                "name": "&#x302; &#x302; Decorator",
                "colour": "#DDDDDD",
                "children": ["5"],
                "data": {
                    "Type": "py_trees.composites.Decorator",
                    "Feedback": "Wearing the hats",
                },
            },
            "5": {
                "id": "5",
                "status": "INVALID",
                "name": "Decorated Beyond The Beliefs of an Agnostic Rhino",
                "colour": "#555555",
                "data": {"Type": "py_trees.composites.Behaviour", "Feedback": "...."},
            },
            "6": {
                "id": "6",
                "status": "INVALID",
                "name": "Behaviour",
                "colour": "#555555",
                "data": {"Type": "py_trees.composites.Behaviour", "Feedback": "..."},
            },
            "7": {
                "id": "7",
                "status": "RUNNING",
                "name": "Worker A",
                "colour": "#555555",
                "data": {
                    "Type": "py_trees.composites.Behaviour",
                    "Feedback": "...",
                    "Blackboard": ["/state/worker_a (x)"],
                },
            },
            "8": {
                "id": "8",
                "status": "INVALID",
                "name": "Worker B",
                "colour": "#555555",
                "data": {
                    "Type": "py_trees.composites.Behaviour",
                    "Feedback": "...",
                    "Blackboard": [
                        "/foobar (w)",
                        "/state/worker_b (x)",
                    ],
                },
            },
            "9": {
                "id": "9",
                "status": "INVALID",
                "name": "Worker C",
                "colour": "#555555",
                "data": {
                    "Type": "py_trees.composites.Behaviour",
                    "Feedback": "...",
                    "Blackboard": [
                        "/foobar (r)",
                        "/state/worker_c (x)",
                    ],
                },
            },
            "10": {
                "id": "10",
                "status": "INVALID",
                "name": "Foo",
                "colour": "#555555",
                "data": {"Type": "py_trees.composites.Behaviour", "Feedback": "..."},
            },
            "11": {
                "id": "11",
                "status": "INVALID",
                "name": "Bar",
                "colour": "#555555",
                "data": {
                    "Type": "py_trees.composites.Behaviour",
                    "Feedback": "...",
                    "Blackboard": [
                        "/foobar (r)",
                    ],
                },
            },
        },
        "blackboard": {
            "behaviours": {  # key metadata per behaviour
                "7": {"/state/worker_a": "x"},
                "8": {
                    "/foobar": "w",
                    "/state/worker_b": "x",
                },
                "9": {
                    "/foobar": "r",
                    "/state/worker_c": "x",
                },
                "11": {
                    "/foobar": "r",
                },
            },
            "data": {},  # key-value store
        },
        "activity": [],  # list of xhtml snippets
    }
    return tree


def generate_activity_timeline() -> typing.List[typing.List[str]]:
    """Generate activity feed."""
    space = "<text>&#xa0;</text>"
    left_arrow = "<text>&#x2190;</text>"
    right_arrow = "<text>&#x2192;</text>"
    # left_right_arrow = '<text>&#x2194;</text>'
    reset = "</text>"
    normal = "<text>"
    cyan = '<text style="color:cyan;">'
    green = '<text style="color:green;">'
    yellow = '<text style="color:darkgoldenrod;">'
    # red = '<text style="color:red;">'
    # monospace = '<text style="font-family: monospace;">'
    # colon_separator = space + ":" + space
    # bar_separator = space + "|" + space
    activity = [
        [
            (
                "/state/worker_a",
                "INITIALISED",
                "Worker A",
                right_arrow
                + space
                + "And his noodly appendage reached forth to tickle the blessed...",
            )
        ],
        [
            ("/foobar", "INITIALISED", "Worker B", right_arrow + space + "oi"),
            ("/state/worker_b", "INITIALISED", "Worker B", right_arrow + space + "5"),
        ],
        [("/state/worker_b", "WRITE", "Worker B", right_arrow + space + "6")],
        [
            ("/foobar", "READ", "Bar", left_arrow + space + "oi"),
            (
                "/state/worker_c",
                "INITIALISED",
                "Worker C",
                right_arrow + space + "boinked",
            ),
        ],
    ]
    formatted_activity = []
    for snippets in activity:
        # formatted_activity.append(formatted_snippets)
        xhtml_snippet = "<table>"
        for key, activity_type, client_name, info in snippets:
            xhtml_snippet += (
                "<tr>"
                "<td>" + cyan + key + reset + "</td>"
                "<td>" + yellow + activity_type + reset + "</td>"
                "<td style='text-align: center;'>"
                + normal
                + client_name
                + reset
                + "</td>"
                "<td>" + green + info + reset + "</td>"
                "</tr>"
            )
        xhtml_snippet += "</table>"
        formatted_activity.append([xhtml_snippet])
    return formatted_activity


def create_demo_tree_list():
    """Create sequence of tree snapshots."""
    activity_timeline = generate_activity_timeline()
    trees = []
    tree = create_demo_tree_definition()
    tree["blackboard"]["data"][
        "/state/worker_a"
    ] = "And his noodly appendage reached forth to tickle the blessed..."
    tree["activity"] = activity_timeline[0]
    trees.append(copy.deepcopy(tree))
    # sequence progressed, but running
    tree["visited_path"] = ["1", "2", "7", "8"]
    tree["behaviours"]["7"]["status"] = "SUCCESS"  # first worker
    tree["behaviours"]["8"]["status"] = "RUNNING"  # middle worker
    tree["blackboard"]["data"][
        "/foobar"
    ] = "oi"  # TODO: flip to True, and fix dump/load problems
    tree["blackboard"]["data"]["/state/worker_b"] = 5
    tree["activity"] = activity_timeline[1]
    trees.append(copy.deepcopy(tree))
    # tree not changed, only blackboard values
    tree["blackboard"]["data"]["/state/worker_b"] = 6
    tree["changed"] = "false"
    tree["activity"] = activity_timeline[2]
    trees.append(copy.deepcopy(tree))
    # sequence failed
    tree["changed"] = "true"
    tree["visited_path"] = ["1", "2", "3", "4", "5", "8", "9", "10", "11"]
    tree["behaviours"]["2"]["status"] = "FAILURE"  # sequence
    tree["behaviours"]["8"]["status"] = "SUCCESS"  # middle worker
    tree["behaviours"]["9"]["status"] = "FAILURE"  # final worker
    tree["behaviours"]["3"]["status"] = "SUCCESS"  # parallel
    tree["behaviours"]["10"]["status"] = "SUCCESS"  # first parallelised
    tree["behaviours"]["11"]["status"] = "RUNNING"  # second parallelised
    tree["behaviours"]["4"]["status"] = "RUNNING"  # decorator
    tree["behaviours"]["5"]["status"] = "RUNNING"  # decorator child
    # del tree['blackboard']['data']['/state/worker_a']
    tree["blackboard"]["data"]["/state/worker_c"] = "boinked"
    tree["activity"] = activity_timeline[3]
    trees.append(copy.deepcopy(tree))
    return trees
