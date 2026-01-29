
import os

def patch_files():
    root_dir = "/Users/abhinav/Downloads/Subtrack/Subtrack-main/_next/static"
    # Exact class string from the minified file (verified via view_file)
    old_class = 'absolute right-4 top-4 size-24 opacity-80 transition-all group-hover:scale-110 group-hover:opacity-100 sm:size-32'
    new_class = 'absolute right-4 top-4 size-48 opacity-80 transition-all group-hover:scale-110 group-hover:opacity-100 sm:size-64 help-onboarding-img'
    
    # 1. Patch JS files for Images and Classes
    print("Scanning JS files in", root_dir)
    count = 0
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".js"):
                filepath = os.path.join(subdir, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Safe replacement chain for images
                    # 1. mascot-6 -> mascot-temp (Save old #4)
                    if 'mascot-6.png' in content:
                        content = content.replace('mascot-6.png', 'mascot-temp.png')
                    
                    # 2. mascot-2 -> mascot-6 (Update #2)
                    if 'mascot-2.png' in content:
                        content = content.replace('mascot-2.png', 'mascot-6.png')
                        
                    # 3. mascot-temp -> mascot-8 (Update #4)
                    if 'mascot-temp.png' in content:
                        content = content.replace('mascot-temp.png', 'mascot-8.png')
                        
                    # 4. mascot-1 -> mascot-5 (Update #1)
                    if 'mascot-1.png' in content:
                        content = content.replace('mascot-1.png', 'mascot-5.png')
                        
                    # 5. mascot-4 -> mascot-7 (Update #3)
                    if 'mascot-4.png' in content:
                        content = content.replace('mascot-4.png', 'mascot-7.png')

                    # Compare and check if any image changes happened
                    if content != original_content:
                        print(f"Patched images in: {file}")
                    
                    # Patch Classes for Zoom
                    if old_class in content:
                        content = content.replace(old_class, new_class)
                        print(f"Patched classes in: {file}")
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        count += 1
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print(f"Total files patched: {count}")

    # 2. Creating Missing Chunk for Demo Page
    chunk_dir = os.path.join(root_dir, "chunks")
    missing_chunk_name = "2394.4709e5215fe0c235.js"
    missing_chunk_path = os.path.join(chunk_dir, missing_chunk_name)
    
    if not os.path.exists(missing_chunk_path):
        print(f"Creating missing chunk: {missing_chunk_name}")
        # Dummy webpack chunk content
        dummy_content = '(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2394],{},function(){"use strict"}]);'
        with open(missing_chunk_path, 'w') as f:
            f.write(dummy_content)
    else:
        print(f"Chunk {missing_chunk_name} already exists.")

    # 3. Patch help.html to inject CSS directly
    help_html_path = "/Users/abhinav/Downloads/Subtrack/Subtrack-main/help.html"
    try:
        with open(help_html_path, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Define CSS content
        css_content = """
<style>
/* Help Section Onboarding Images - 3D Effect Enhancement */
.help-onboarding-img {
  transform: perspective(1200px) rotateY(-3deg) rotateX(2deg);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
}

.help-onboarding-img:hover {
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1.15) translateZ(20px);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
  z-index: 10;
}

/* Ensure clean initial state */
.group:hover .help-onboarding-img {
    opacity: 1 !important;
}
</style>
"""
        # Inject before </head>
        if '</head>' in html:
            # Check if we already added the link, replace it or append
            if '<link rel="stylesheet" href="/help-images-3d.css" />' in html:
                 html = html.replace('<link rel="stylesheet" href="/help-images-3d.css" />', css_content)
            elif '<style>' not in html or '.help-onboarding-img' not in html:
                 html = html.replace('</head>', f'{css_content}\n</head>')
            
            with open(help_html_path, 'w', encoding='utf-8') as f:
                f.write(html)
            print("Injected CSS into help.html")
            
    except Exception as e:
        print(f"Error patching help.html: {e}")

if __name__ == "__main__":
    patch_files()
