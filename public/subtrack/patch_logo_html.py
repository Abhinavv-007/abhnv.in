
import os
import re

TARGET_FILES = [
    "index.html",
    "demo.html"
]
HELP_DIR = "help"

CSS_LINK = '<link rel="stylesheet" href="/logo-fix.css">'
LOGO_REPLACEMENT = '<img alt="SubTrack" src="/_static/logo/logo.png" width="64" height="64" class="logo-fix-target object-contain">'

def patch_file(file_path):
    print(f"Patching {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS in HEAD
    if 'href="/logo-fix.css"' not in content:
        content = content.replace('</head>', f'  {CSS_LINK}\n</head>')
    
    # 2. Replace Logo IMG tags (Aggressive regex)
    # Matches: <img ... alt="SubTrack" ... > (attributes in any order)
    # We want to replace the WHOLE tag.
    
    # Pattern explanation:
    # <img          : start tag
    # [^>]*         : any chars up to alt
    # alt=["\']SubTrack["\'] : alt="SubTrack"
    # [^>]*         : any chars after
    # >             : end tag
    
    # Note: Regex parsing HTML is fragile, but sufficient for this static build artifcat.
    
    # We use a function to handle the replacement so we can check context (like sidebar)
    def replace_logo(match):
        original_tag = match.group(0)
        # Check if it's in aside/sidebar context? Hard to tell from tag alone.
        # But our CSS classes handle sidebar sizing (".logo-fix-target" vs "aside .logo-fix-target")
        # So we can use a standard tag structure.
        
        # Preserve classes if needed? 
        # Actually, let's just use a clean tag. The CSS handles layout.
        
        return LOGO_REPLACEMENT

    # Regex that finds img tag containing alt="SubTrack"
    # Case insensitive flag? Content might have 'subtrack' or 'SubTrack'. User says 'SubTrack'.
    pattern = re.compile(r'<img[^>]*alt=["\']SubTrack["\'][^>]*>', re.IGNORECASE)
    
    new_content = pattern.sub(replace_logo, content)
    
    # 3. Fix demo.html sidebar specifics
    # Index.html might need specific handling for the header container if it's hidden
    
    if file_path.endswith("demo.html"):
        # Fix sidebar logo container centering
        # Locate the link wrapping the logo: <a ... href="index.html">
        # Add a class or style to center it.
        # Pattern: <a [^>]*href="index.html"[^>]*>
        
        def patch_sidebar_link(match):
            tag = match.group(0)
            if 'class="' in tag:
                # Append flex centering classes
                return tag.replace('class="', 'class="flex items-center justify-center w-full ')
            return tag

        # This is risky doing global replacement for index.html link.
        # But in demo.html sidebar, it usually is the logo link.
        # Let's rely on CSS rule `aside a[href="index.html"]` we added in logo-fix.css
        pass

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("  Updated.")
    else:
        print("  No logo tags changed (might already be patched).")

def main():
    # Root files
    for f in TARGET_FILES:
        if os.path.exists(f):
            patch_file(f)
            
    # Help files
    for root, dirs, files in os.walk(HELP_DIR):
        for file in files:
            if file.endswith(".html"):
                patch_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
