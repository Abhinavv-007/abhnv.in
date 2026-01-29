#!/usr/bin/env python3
"""
Safe rebranding script for SubTrack.
ONLY modifies text content, NEVER touches inline <script> tags.
"""

import re
import sys
from typing import Tuple

def safe_rebrand_html(filepath: str) -> Tuple[str,  int]:
    """
    Safely rebrand HTML by only replacing text OUTSIDE of <script> tags.
    Returns (modified_content, num_changes)
    """
    print(f"Reading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Strategy: Split by <script> tags, only modify non-script parts
    parts = re.split(r'(<script[^>]*>.*?</script>)', content, flags=re.DOTALL)
    
    for i in range(len(parts)):
        # Only modify odd-indexed parts (non-script content)
        if i % 2 == 0:  # Even index = not a script tag
            before = parts[i]
            
            # BRANDING: Vexly → SubTrack
            parts[i] = parts[i].replace('Vexly', 'SubTrack')
            parts[i] = parts[i].replace('vexly', 'subtrack')
            
            # PRICING: Remove old pricing, update to new
            # Remove "50% OFF" / "Early Adopter" badges
            parts[i] = re.sub(
                r'<div[^>]*>.*?Early Adopter Discount - 50% OFF.*?</div>',
                '',
                parts[i],
                flags=re.DOTALL
            )
            
            # PRICING: $24 → $2, $48 → $2
            parts[i] = re.sub(r'\$24(?!\d)', '$2', parts[i])
            parts[i] = re.sub(r'\$48(?!\d)', '$2', parts[i])
            
            # PRICING: $39 → $15, $78 → $15  
            parts[i] = re.sub(r'\$39(?!\d)', '$15', parts[i])
            parts[i] = re.sub(r'\$78(?!\d)', '$15', parts[i])
            
            # PRICING LABELS: "1-Year" → "Monthly", "Lifetime" → "Annual"
            parts[i] = parts[i].replace('1-Year License', 'Monthly Plan')
            parts[i] = parts[i].replace('Lifetime License', 'Annual Plan')
            parts[i] = parts[i].replace('12 months', '1 month')
            parts[i] = parts[i].replace('yours forever', '12 months of service')
            
            # Remove "POPULAR" badge
            parts[i] = re.sub(
                r'<div[^>]*>.*?(Popular|POPULAR).*?</div>',
                '',
                parts[i]
            )
            
            # SUPPORT: Discord → LinkedIn (text only, not impacting actual links/icons)
            parts[i] = re.sub(r'Discord Member', 'LinkedIn Connection', parts[i])
            parts[i] = re.sub(r'>Discord<', '>LinkedIn<', parts[i])
            
            # Track changes
            if before != parts[i]:
                changes += 1
    
    content = ''.join(parts)
    
    print(f"✅ Made changes to {changes} sections")
    return content, changes

def main():
    files = [
        ('/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/index_fresh.html',
         '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/index.html'),
        ('/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/help_fresh.html',
         '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/help.html'),
    ]
    
    for source, dest in files:
        print(f"\n{'='*60}")
        print(f"Processing: {source}")
        
        content, changes = safe_rebrand_html(source)
        
        # Backup existing if it exists
        import os
        if os.path.exists(dest):
            backup = dest + '.corrupted-backup'
            print(f"Backing up existing {dest} to {backup}")
            os.rename(dest, backup)
        
        # Write rebranded version
        print(f"Writing to {dest}...")
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Completed: {changes} sections modified")
    
    print(f"\n{'='*60}")
    print("✅ REBRANDING COMPLETE!")
    print("\n🔄 Please reload http://localhost:3000 in your browser")

if __name__ == '__main__':
    main()
