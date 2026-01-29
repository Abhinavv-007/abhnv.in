#!/usr/bin/env python3
"""
Extract inline scripts from HTML to debug the null error
"""

import re

filepath = '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all inline scripts (between <script> and </script> tags without src attribute)
inline_scripts = re.findall(r'<script(?![^>]*src=)>([^<]+)</script>', content)

print(f"Found {len(inline_scripts)} inline scripts\n")
print("="*80)

for i, script in enumerate(inline_scripts, 1):
    print(f"\n## Inline Script {i}:")
    print("-"*80)
    # First 500 chars to avoid overwhelming output
    print(script[:500])
    if len(script) > 500:
        print(f"\n... (truncated, total length: {len(script)} chars)")
    print("="*80)
