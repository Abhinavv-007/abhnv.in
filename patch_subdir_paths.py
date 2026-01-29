
import os
import re

TARGET_DIR = "subtrack"
PREFIX = "/subtrack/"

def patch_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # regex to match absolute paths starting with / (but not //)
    # 1. src="/..." or href="/..." or content="/..."
    # 2. url(/...) or url("/...") or url('/...')
    # 3. srcset="/..."
    
    def replacer(match):
        # match.group(0) is the whole string e.g. src="/_next..."
        # We want to insert /subtrack/ after the leading quote/paren
        # format is usually: prefix + quote + / + rest
        full = match.group(0)
        
        # Guard: if it already starts with /subtrack/, don't touch it
        # The regex ensures we match starting with /, so check if the path part starts with subtrack/
        
        # Find where the path starts (first /)
        # It will be the last character of group 1 + / 
        # Actually let's use groups.
        # Group 1: attribute=" or url(
        # Group 2: the path starting with /
        
        prefix_part = match.group(1)
        path_part = match.group(2) # starts with /
        
        if path_part.startswith(PREFIX) or path_part.startswith(PREFIX[:-1]): # /subtrack or /subtrack/
            return full
            
        return f"{prefix_part}{PREFIX}{path_part[1:]}"

    # Pattern 1: Attributes src, href, content, action, data-src
    # Matches: src="/abc"  href="/abc"
    # Group 1: src="
    # Group 2: /abc
    content = re.sub(r'(src="|href="|content="|action="|data-src="|poster="|src=\'|href=\'|content=\'|action=\'|data-src=\'|poster=\')(/[^/][^"\']*)', replacer, content)

    # Pattern 2: start with just " /_next" (for certain js configs/json/srcset)
    # Be careful here.
    content = re.sub(r'(")(/_next[^"]*)', replacer, content)
    content = re.sub(r'(")(/_static[^"]*)', replacer, content)

    # Pattern 3: CSS url()
    # url(/foo)  url('/foo')  url("/foo")
    # Group 1: url( or url(' or url("
    # Group 2: /foo...
    content = re.sub(r'(url\(\s*[\'"]?)(/[^/][^\)\'"]*)', replacer, content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        # print(f"Patched {file_path}")

def main():
    print("Starting robust path patch...")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.json', '.map')):
                patch_file(os.path.join(root, file))
                count += 1
    print(f"Processed {count} files.")

if __name__ == "__main__":
    main()
