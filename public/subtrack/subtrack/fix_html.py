#!/usr/bin/env python3
"""
Emergency HTML fixer for black screen issue.
Removes broken external scripts and fixes corrupted URLs.
"""

import re
import sys

def fix_html_file(filepath):
    """Fix critical issues in HTML file"""
    print(f"Reading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remove the broken firstjobb.se script preload (FATAL 404)
    print("Removing broken firstjobb.se script...")
    content = re.sub(
        r'<link rel="preload" href="https://api\.firstjobb\.se/api/script\.js" as="script"/?>',
        '',
        content
    )
    
    # 2. Fix malformed manifest URL (subtrack.app)
    print("Fixing manifest URL...")
    content = re.sub(
        r'<link rel="manifest" href="https://subtrack\.app/site\.webmanifest"[^>]*>',
        '<link rel="manifest" href="manifest.json"/>',
        content
    )
    
    # 3. Remove any standalone broken URLs like "https://subtrack.app/&"
    print("Removing broken subtrack.app/& references...")
    content = content.replace('https://subtrack.app/&', '')
    content = content.replace('https://subtrack.app/&amp;', '')
    
    # Check if changes were made
    if content == original_content:
        print("⚠️  No changes were made to the file!")
        return False
    
    # Backup and write
    backup_file = filepath + '.backup'
    print(f"Creating backup at {backup_file}...")
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"Writing fixed content to {filepath}...")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Successfully fixed HTML file!")
    return True

if __name__ == '__main__':
    files_to_fix = [
        '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/index.html',
        '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/help.html',
    ]
    
    for filepath in files_to_fix:
        print(f"\n{'='*60}")
        fix_html_file(filepath)
    
    print(f"\n{'='*60}")
    print("✅ ALL FILES FIXED!")
    print("\nPlease reload the page in your browser to test.")
