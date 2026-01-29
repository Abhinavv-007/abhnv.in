
import os

DEMO_FILE = "demo.html"
DEMO_DIR = "demo" # If there are subpages like demo/billing.html
CSS_LINK = '<link rel="stylesheet" href="/demo-mobile-fix.css">'

def patch_file(file_path):
    print(f"Patching {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'demo-mobile-fix.css' not in content:
        # Inject before </head>
        if '</head>' in content:
            content = content.replace('</head>', f'  {CSS_LINK}\n</head>')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print("  Injected CSS.")
        else:
            print("  Warning: No </head> tag found.")
    else:
        print("  Already patched.")

def main():
    # Patch root demo.html
    if os.path.exists(DEMO_FILE):
        patch_file(DEMO_FILE)
    
    # Patch sub-pages if they exist (based on sidebar links seeing demo/x.html)
    if os.path.exists(DEMO_DIR):
        for root, dirs, files in os.walk(DEMO_DIR):
            for file in files:
                if file.endswith(".html"):
                    patch_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
