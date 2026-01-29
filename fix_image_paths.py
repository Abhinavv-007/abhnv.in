
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

    # Strategy: Find any substring matching /_next/image?url=... and replace it IN PLACE.
    # This covers src, srcset, imageSrcSet, and CSS url() all at once.
    
    # Pattern: /_next/image\?url=([^&"'\s]+)
    # The URL param is URL-encoded.
    
    pattern = r'/_next/image\?url=([^&"\'\s]+)(?:&amp;|&)[^"\'\s]*'
    
    def replacer(match):
        encoded_url = match.group(1)
        decoded_url = urllib.parse.unquote(encoded_url)
        
        # If it's a root path like /_static/..., prepend /subtrack
        if decoded_url.startswith("/") and not decoded_url.startswith("/subtrack/"):
            return "/subtrack" + decoded_url
        return decoded_url

    # Iterate until no more changes (to handle multiple on one line if needed, though re.sub is global)
    content = re.sub(pattern, replacer, content)
    
    # Also fix any "srcset" attributes that might have weird "1x, 2x" formatting
    # The above regex simply replaces the URL part. 
    # Example: srcset="/_next/image... 1x, /_next/image... 2x"
    # Becomes: srcset="/subtrack/_static... 1x, /subtrack/_static... 2x"
    # This is exactly what we want.
    
    # RELAX AGGRESSIVE CSS HIDING
    # If we find the aggressive hiding block we added, let's tone it down
    # We remove "display: none !important" and "opacity: 0 !important" from the skeleton block
    # to avoid persistent blank spaces if things fail to hydrate.
    if ".loading-skeleton" in content and "display: none !important" in content:
        content = content.replace("display: none !important;", "display: block !important;")
        content = content.replace("opacity: 0 !important;", "opacity: 1 !important;")
        content = content.replace("visibility: hidden !important;", "visibility: visible !important;")
    
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
