#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_viz/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################
"""
Demo trees to feed to the web app
"""
##############################################################################
# Imports
##############################################################################

##############################################################################
# Methods
##############################################################################


def create_demo_tree_definition():
    tree = {
        'timestamp': 1563938995,
        'visited_path': ['1', '2', '3', '4', '5', '7', '8'],
        'behaviours': {
            '1': {
                'id': '1',
                'status': 'RUNNING',
                'name': 'Selector',
                'colour': '#00FFFF',
                'children': ['2', '3', '4', '6'],
                'data': {
                    'Type': 'py_trees.composites.Selector',
                    'Feedback': "Decision maker",
                },
            },
            '2': {
                'id': '2',
                'status': 'FAILURE',
                'name': 'Sequence',
                'colour': '#FFA500',
                'children': ['7', '8', '9'],
                'data': {
                    'Type': 'py_trees.composites.Sequence',
                    'Feedback': "Worker"
                },
            },
            '3': {
                'id': '3',
                'status': 'FAILURE',
                'name': 'Parallel',
                'details': 'SuccessOnOne',
                'colour': '#FFFF00',
                'data': {
                    'Type': 'py_trees.composites.Parallel',
                    'Feedback': 'Baked beans is good for your heart, baked beans makes you',
                },
            },
            '4': {
                'id': '4',
                'status': 'RUNNING',
                'name': '&#x302; &#x302; Decorator',
                'colour': '#DDDDDD',
                'children': ['5'],
                'data': {
                    'Type': 'py_trees.composites.Decorator',
                    'Feedback': 'Wearing the hats',
                },
            },
            '5': {
                'id': '5',
                'status': 'RUNNING',
                'name': 'Decorated Beyond The Beliefs of an Agnostic Rhino',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "...."
                },
            },
            '6': {
                'id': '6',
                'status': 'INVALID',
                'name': 'Behaviour',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "..."
                },
            },
            '7': {
                'id': '7',
                'status': 'SUCCESS',
                'name': 'Worker A',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "..."
                },
            },
            '8': {
                'id': '8',
                'status': 'FAILURE',
                'name': 'Worker B',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "..."
                },
            },
            '9': {
                'id': '9',
                'status': 'INVALID',
                'name': 'Worker C',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "..."
                },
            },
        }
    }
    return tree
