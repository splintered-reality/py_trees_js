#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
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

import copy

##############################################################################
# Methods
##############################################################################


def create_demo_tree_definition():
    tree = {
        'changed': "true",
        'timestamp': 1563938995,
        'visited_path': ['1', '2', '7'],
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
                'status': 'RUNNING',
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
                'status': 'INVALID',
                'name': 'Parallel',
                'details': 'SuccessOnOne',
                'colour': '#FFFF00',
                'children': ['10', '11'],
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
                'status': 'INVALID',
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
                'status': 'RUNNING',
                'name': 'Worker A',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "...",
                    'Blackboard': [
                        '/state/worker_a (x)'
                    ]
                },
            },
            '8': {
                'id': '8',
                'status': 'INVALID',
                'name': 'Worker B',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "...",
                    'Blackboard': [
                        '/foobar (w)',
                        '/state/worker_b (x)',
                    ]
                },
            },
            '9': {
                'id': '9',
                'status': 'INVALID',
                'name': 'Worker C',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "...",
                    'Blackboard': [
                        '/foobar (r)',
                        '/state/worker_c (x)',
                    ]
                },
            },
            '10': {
                'id': '10',
                'status': 'INVALID',
                'name': 'Foo',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "..."
                },
            },
            '11': {
                'id': '11',
                'status': 'INVALID',
                'name': 'Bar',
                'colour': '#555555',
                'data': {
                    'Type': 'py_trees.composites.Behaviour',
                    'Feedback': "...",
                    'Blackboard': [
                        '/foobar (r)',
                    ]
                },
            },
        },
        'blackboard': {
            'behaviours': {
                '7': {
                    '/state/worker_a': 'x'
                },
                '8': {
                    '/foobar': 'w',
                    '/state/worker_b': 'x',
                },
                '9': {
                    '/foobar': 'r',
                    '/state/worker_c': 'x',
                },
                '11': {
                    '/foobar': 'r',
                },
            },
            'data': {},
        }
    }
    return tree


def create_demo_tree_list():
    trees = []
    tree = create_demo_tree_definition()
    tree['blackboard']['data']['/state/worker_a'] = 'lookin good'
    trees.append(copy.deepcopy(tree))
    # sequence progressed, but running
    tree['visited_path'] = ['1', '2', '7', '8']
    tree['behaviours']['7']['status'] = 'SUCCESS'  # first worker
    tree['behaviours']['8']['status'] = 'RUNNING'  # middle worker
    tree['blackboard']['data']['/foobar'] = 'oi'  # TODO: flip to True, and fix dump/load problems
    tree['blackboard']['data']['/state/worker_b'] = 5
    trees.append(copy.deepcopy(tree))
    # tree not changed, only blackboard values
    tree['blackboard']['data']['/state/worker_b'] = 6
    tree['changed'] = 'false'
    trees.append(copy.deepcopy(tree))
    # sequence failed
    tree['changed'] = 'true'
    tree['visited_path'] = ['1', '2', '3', '4', '5', '8', '9', '10', '11']
    tree['behaviours']['2']['status'] = 'FAILURE'  # sequence
    tree['behaviours']['8']['status'] = 'SUCCESS'  # middle worker
    tree['behaviours']['9']['status'] = 'FAILURE'  # final worker
    tree['behaviours']['3']['status'] = 'SUCCESS'  # parallel
    tree['behaviours']['10']['status'] = 'SUCCESS'  # first parallelised
    tree['behaviours']['11']['status'] = 'RUNNING'  # second parallelised
    tree['behaviours']['4']['status'] = 'RUNNING'  # decorator
    tree['behaviours']['5']['status'] = 'RUNNING'  # decorator child
    # del tree['blackboard']['data']['/state/worker_a']
    tree['blackboard']['data']['/state/worker_c'] = 'boinked'
    trees.append(copy.deepcopy(tree))
    return trees
