
import os

HELP_DIR = "help"
SCRIPTS_TO_INJECT = [
    '<script src="/fix-all-issues.js"></script>',
    '<script src="/fix-visibility.js"></script>',
    '<script src="/sidebar-accordion.js"></script>'
]

def patch_file(file_path):
    print(f"Patching {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)
    
    # 1. Ensure body end tag exists (it should)
    if '</body>' not in content:
        print("  Skipping: No body end tag found.")
        return

    # 2. Inject scripts before </body> if not present
    scripts_block = "\n    ".join(SCRIPTS_TO_INJECT)
    
    # We check each script individually to avoid duplication
    new_scripts = []
    for script in SCRIPTS_TO_INJECT:
        # Check simplified version (src only) just in case
        src = script.split('src="')[1].split('"')[0]
        if src not in content:
            new_scripts.append(script)
    
    if new_scripts:
        injection = "\n    " + "\n    ".join(new_scripts) + "\n"
        content = content.replace('</body>', f'{injection}</body>')
        print(f"  Injected {len(new_scripts)} scripts.")
    else:
        print("  Scripts already present.")
        
    # 3. Clean up potential double injections or bad previous edits
    # (Optional based on findings, but `fix-all-issues.js` was seen appearing twice in some logs? We'll rely on the check above)
    
    if len(content) != original_len:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("  Saved.")

def main():
    for root, dirs, files in os.walk(HELP_DIR):
        for file in files:
            if file.endswith(".html"):
                patch_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
