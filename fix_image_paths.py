
import os
import re
import urllib.parse

TARGET_DIR = "public/subtrack"

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Regex to find next.js image calls
    # src="/subtrack/_next/image?url=%2F_static%2Flogo%2Flogo.png&amp;w=32&amp;q=75"
    # or src="/_next/image?url=..." if my previous pathing missed some
    
    # We want to capture the 'url' parameter value.
    # Pattern: src=["'](.*?/_next/image\?url=(.*?)&amp;.*?)["']
    
    def replace_image_url(match):
        full_match = match.group(0) # The whole src="..." string
        quote = full_match[0:5] # src=" or src='
        # actually, let's just use re.sub with a function
        
        url_param_encoded = match.group(2)
        url_param = urllib.parse.unquote(url_param_encoded)
        
        # url_param is like "/_static/logo/logo.png" or "/images/..."
        # We need to prepend /subtrack if it starts with / and doesn't have it
        if url_param.startswith("/") and not url_param.startswith("/subtrack/"):
            new_url = "/subtrack" + url_param
        else:
            new_url = url_param
            
        return f'src="{new_url}"'

    # Fixed Pattern: src="..._next/image?url=..."
    # We catch the whole src attribute to parse it properly
    pattern = r'src=["\'].*?_next/image\?url=([^&"\']+).*?["\']'
    
    def replace_image_url(match):
        # match.group(0) is the full src="..." string
        # match.group(1) is the URL param (e.g. %2F_static%2Flogo.png)
        
        url_param_encoded = match.group(1)
        url_param = urllib.parse.unquote(url_param_encoded)
        
        # url_param is like "/_static/logo/logo.png" or "/images/..."
        # Prepend /subtrack if missing
        if url_param.startswith("/") and not url_param.startswith("/subtrack/"):
            new_url = "/subtrack" + url_param
        else:
            new_url = url_param
            
        return f'src="{new_url}"'
    
    content = re.sub(pattern, replace_image_url, content)
    
    # Also handle srcset if possible, but that's harder. 
    # For now, let's nuke srcset so the browser falls back to src
    # srcset="..." -> remove it if it contains _next/image
    content = re.sub(r'srcset="[^"]*?_next/image[^"]*"', '', content)
    
    # Also fix the weird one the user mentioned specifically if it wasn't caught
    # https://www.abhnv.in/_next/image?url=%2F_static%2Flanding%2Fdashboard-hero-dark.png&w=3840&q=75
    # The user might be seeing this because of a background-image or something not in src? 
    # Or an unpatched file?
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed images in {file_path}")

def main():
    print("Running image path fix...")
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
