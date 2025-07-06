#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Angle data generator stub
"""

import json
import random

# Simulate angle data
angle_data = {
    "angle": random.randint(-90, 90),
    "range": [-90, 90]
}

# Output as JSON
print(json.dumps(angle_data))
