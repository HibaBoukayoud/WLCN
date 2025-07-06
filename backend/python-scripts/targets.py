#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Targets data generator stub
"""

import json
import random

# Simulate targets data
num_targets = random.randint(1, 5)
targets_data = {
    "count": num_targets,
    "targets": [
        {
            "id": i + 1,
            "distance": random.randint(10, 200),
            "angle": random.randint(-90, 90)
        } for i in range(num_targets)
    ]
}

# Output as JSON
print(json.dumps(targets_data))
