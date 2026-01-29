
import os
import re

TARGET_DIR = "public/subtrack"

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix Help Link: "/subtrack/help" -> "/subtrack/help.html"
    # Matches href="/subtrack/help" or href="/subtrack/help/"
    content = content.replace('href="/subtrack/help"', 'href="/subtrack/help.html"')
    content = content.replace('href="/subtrack/help/"', 'href="/subtrack/help.html"')
    
    # 2. Fix Demo Link just in case: "/subtrack/demo" -> "/subtrack/demo.html"
    content = content.replace('href="/subtrack/demo"', 'href="/subtrack/demo.html"')
    content = content.replace('href="/subtrack/demo/"', 'href="/subtrack/demo.html"')
    
    # 3. Fix Image Paths if needed
    # If the HTML asks for .webp but we only have .png in testimonials, or vice versa.
    # Based on grep, we will see what it asks for. 
    # Attempt to fix double subtrack if it happened: /subtrack/subtrack/
    content = content.replace('/subtrack/subtrack/', '/subtrack/')
    
    # 4. Hide stuck loaders harder
    if '</head>' in content:
        style_fix = """
<style>
  /* SUPER AGGRESSIVE LOADING FIX */
  .animate-pulse, .loading-skeleton, [class*="skeleton"] {
     display: none !important;
     opacity: 0 !important;
     visibility: hidden !important;
     animation: none !important;
  }
  /* Fix logo visibility specifically */
  img[src*="logo"], .logo {
     opacity: 1 !important;
     visibility: visible !important;
     display: block !important;
  }
</style>
"""
        # Insert before </head>
        content = content.replace('</head>', style_fix + '</head>')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        # print(f"Fixed {file_path}")

def main():
    print("Running final path & loader fix...")
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
