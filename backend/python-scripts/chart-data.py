#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import random
import math

def generate_hourly_target_data():
    
    hours = list(range(0, 24))  # All 24 hours: 0, 1, 2, ..., 23
    
    # Generate realistic pattern with more activity during day hours
    targets_detected = []
    
    for hour in hours:
        if 6 <= hour <= 18:  # Day time (6 AM to 6 PM) - more activity
            base_targets = 4 + 3 * math.sin((hour - 6) * math.pi / 12)  # Peak around noon
            noise = random.uniform(-1, 1)
            targets = max(0, min(8, int(base_targets + noise)))
        else:  # Night time - less activity
            base_targets = 1 + random.uniform(0, 2)
            targets = max(0, min(8, int(base_targets)))
        
        targets_detected.append(targets)
    
    return {
        "hours": [f"{hour:02d}" for hour in hours],
        "targets": targets_detected,
        "total_detections": sum(targets_detected),
        "peak_hour": hours[targets_detected.index(max(targets_detected))],
        "avg_per_hour": round(sum(targets_detected) / len(targets_detected), 1)
    }

# Generate and output chart data
chart_data = generate_hourly_target_data()
print(json.dumps(chart_data, indent=2))
