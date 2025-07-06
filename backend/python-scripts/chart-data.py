#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Chart data generator stub
"""

import json
import random

# Simulate chart data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
chart_data = {
    "labels": months[:6],
    "datasets": [
        {
            "label": "Targets Detected",
            "data": [random.randint(0, 20) for _ in range(6)]
        }
    ]
}

# Output as JSON
print(json.dumps(chart_data))
