
import os
import re

TARGET_DIR = "public/subtrack"

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Remove style="opacity:0..." to ensure content is visible
    # Matches style="...opacity:0..." and replaces with style="...opacity:1..." or removes it?
    # Safer to just replace opacity:0 with opacity:1
    content = content.replace('opacity:0', 'opacity:1')
    content = content.replace('visibility:hidden', 'visibility:visible')
    
    # 2. Fix FAQ accordion script path if it's broken
    # Ensure it points to /subtrack/faq-accordion.js
    if 'src="/faq-accordion.js"' in content:
        content = content.replace('src="/faq-accordion.js"', 'src="/subtrack/faq-accordion.js"')
    
    # 3. Fix other root scripts that might have been missed by previous regex
    # Common ones seen in head
    scripts = [
        "email-patch.js", "theme-switcher.js", "coming-soon-config.js",
        "coming-soon-modal.js", "coming-soon-interceptor.js", "coming-soon-home.js",
        "remove-testimonials.js", "fix-visibility.js", "fix-pricing.js", 
        "fix-all-issues.js", "modal-button-fix.js"
    ]
    
    for s in scripts:
        # If it finds src="/script.js", replace with src="/subtrack/script.js"
        content = content.replace(f'src="/{s}"', f'src="/subtrack/{s}"')
        
    # 4. Also Check CSS links
    css_files = ["coming-soon.css", "coming-soon-home.css", "logo-fix.css"]
    for c in css_files:
        content = content.replace(f'href="/{c}"', f'href="/subtrack/{c}"')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file_path}")

def main():
    print("Running emergency visibility fix...")
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
