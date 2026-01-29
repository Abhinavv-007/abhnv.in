
import os
import re

TARGET_DIR = "subtrack"
PREFIX = "/subtrack/"

# Regex to find absolute paths starting with / but NOT // (protocol relative)
# key="" or key=''
# We want to match src="/..." href="/..." url("/...") content="/..."
# But exclude src="/subtrack/..." if already patched.

PATTERNS = [
    (r'(src=["\'])/([^/])', r'\1' + PREFIX + r'\2'),
    (r'(href=["\'])/([^/])', r'\1' + PREFIX + r'\2'),
    (r'(content=["\'])/([^/])', r'\1' + PREFIX + r'\2'),
    (r'(url\s*\()([\'"]?)/([^/])', r'\1\2' + PREFIX + r'\3'),
    # Handle srcset? " /_next..." -> " /subtrack/_next..."
    # This is tricky for srcset. simple replace of " /" might be dangerous.
    # Let's target specific known next/static patterns in srcset if possible.
    (r'(srcset=["\'])(/[^/])', r'\1' + PREFIX + r'\2'), # Main one
    (r'(, )(/[^/])', r'\1' + PREFIX + r'\2') # Subsequent in srcset
]

# We need a safer replace that prevents double-patching.
# E.g. don't patch if it sees /subtrack/ already.
# Actually, the regex `/([^/])` enforces that the char after / is NOT /.
# But if it is 's' (subtrack), we should also check.

def patch_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Simple strings first - fastest, safest for generated code
    # We want to replace all `"/_next` with `"/subtrack/_next`
    # `"/_static` -> `"/subtrack/_static`
    # `"/images` -> `"/subtrack/images`
    # `"/logo` -> `"/subtrack/logo`
    # `"/manifest` -> `"/subtrack/manifest`
    # `"/favicon` -> `"/subtrack/favicon`
    # `"/demo` -> `"/subtrack/demo`
    # `"/help` -> `"/subtrack/help`
    # `"/login` -> `"/subtrack/login`
    # `"/index` -> `"/subtrack/index`
    
    # We also need to handle root `/` links like `href="/"` -> `href="/subtrack/"`
    
    # List of known root folders/files in the project
    known_roots = [
        "_next", "_static", "images", "public", "demo", "help", 
        "dashboard", "login", "register", "index.html", "favicon", 
        "manifest.json", "logo-fix.css", "demo-mobile-fix.css",
        "sidebar-accordion.js", "fix-visibility.js", "fix-all-issues.js"
    ]
    
    # Replace href="/" with href="/subtrack/"
    content = content.replace('href="/"', 'href="/subtrack/"')
    content = content.replace("href='/'", "href='/subtrack/'")
    
    for root_item in known_roots:
        # Match "/item
        content = content.replace(f'"/{root_item}', f'"/subtrack/{root_item}')
        content = content.replace(f"'/{root_item}", f"'/subtrack/{root_item}")
        
    # Also fix CSS url(/...)
    # content = re.sub(r'url\(\s*[\'"]?\/([^)\'"]+)', lambda m: f'url({PREFIX}{m.group(1)}', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        # print(f"Patched {file_path}")

def main():
    print("Starting path patch...")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.json')):
                patch_file(os.path.join(root, file))
                count += 1
    print(f"Processed {count} files.")

if __name__ == "__main__":
    main()
