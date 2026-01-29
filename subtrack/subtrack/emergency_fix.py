#!/usr/bin/env python3
"""
Emergency CSS injection to bypass broken React hydration.
Forces content to be visible even if JavaScript crashes.
"""

import re

def inject_emergency_css(filepath):
    """Inject CSS to force visibility of content"""
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Emergency CSS to force all content visible
    emergency_css = """<style id="emergency-visibility-fix">
/* EMERGENCY FIX: Force content visible even if React hydration crashes */
body, body > *, body > * > *, body > * > * > * {
    opacity: 1 !important;
    visibility: visible !important;
}
#__next, #__next > *, main {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
}
/* Ensure layout works */
[style*="opacity: 0"], [style*="opacity:0"] {
    opacity: 1 !important;
}
</style>"""
    
    # Inject right after <head> tag
    content = content.replace('<head>', f'<head>{emergency_css}', 1)
    
    # Backup
    backup_path = filepath + '.pre-emergency-fix'
    print(f"Creating backup at {backup_path}...")
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(open(filepath).read())
    
    # Write fixed version
    print(f"Injecting emergency CSS into {filepath}...")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Emergency CSS injected!")
    return True

if __name__ == '__main__':
    files = [
        '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/index.html',
        '/Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/help.html',
    ]
    
    for filepath in files:
        print(f"\n{'='*60}")
        inject_emergency_css(filepath)
    
    print(f"\n{'='*60}")
    print("✅ EMERGENCY FIX APPLIED!")
    print("\n🔄 Please reload the browser to test.")
    print("\n⚠️  This is a temporary workaround. Content should be visible now,")
    print("   but animations and some interactive features may not work.")
