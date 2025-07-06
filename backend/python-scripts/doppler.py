#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Doppler data generator stub
"""

import json
import random

# Simulate Doppler data
doppler_data = {
    "range": [0, 100],
    "values": [random.randint(0, 100) for _ in range(5)]
}

# Output as JSON
print(json.dumps(doppler_data))
