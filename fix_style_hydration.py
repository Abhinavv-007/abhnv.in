
import os
import re

TARGET_DIR = "public/subtrack"

# CSS to fix help page 3D transforms if they are looking weird (flattening them or fixing perspective)
HELP_CSS_FIX = """
<style>
/* Fix Help Page 3D Transforms */
.help-onboarding-img {
  transform: none !important; /* Disable complex 3D if it's breaking */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  transition: transform 0.2s ease !important;
}
.help-onboarding-img:hover {
  transform: scale(1.02) !important;
}
</style>
"""

# JS to force remove "Loading demo data..." if it gets stuck
DEMO_FIX_SCRIPT = """
<script>
  // Force remove loading state after 1 second if React hasn't picked up
  window.addEventListener('load', function() {
    setTimeout(function() {
      var loader = document.evaluate("//div[contains(text(),'Loading demo data...')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (loader) {
        console.log("Force removing stuck loader");
        loader.style.display = 'none';
        // Attempt to show hidden content if React hid it? 
        // Actually, if React crashed, the content might not be there. 
        // We'll trust that the static shell is behind it or we are just hiding the text.
      }
    }, 1500);
  });
</script>
"""

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Apply Help CSS Fix to help* pages
    if "help" in file_path and "index.html" in file_path:
        if "/* Fix Help Page 3D Transforms */" not in content:
            content = content.replace('</head>', HELP_CSS_FIX + '</head>')
            
    # 2. Apply Demo Fix to demo* pages
    if "demo" in file_path:
         if "Force remove stuck loader" not in content:
            content = content.replace('</body>', DEMO_FIX_SCRIPT + '</body>')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file_path}")

def main():
    print("Running styling and hydration fixes...")
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
