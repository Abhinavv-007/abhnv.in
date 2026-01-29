
import os
import re

def inspect():
  # 1. Inspect JS chunk for mascot and class
  base = "/Users/abhinav/Downloads/Subtrack/Subtrack-main/_next/static/chunks/"
  target_file = "6058-14891c9571c01c1e.js"
  path = os.path.join(base, target_file)
  
  try:
    with open(path, 'r') as f:
      content = f.read()
      
    print(f"File: {target_file}, Size: {len(content)}")
    
    # Find mascots
    mascots = re.findall(r'mascot-\d+\.png', content)
    print("Mascots found:", mascots)
    
    # Show context (limit to first few to avoid spam)
    matches = list(re.finditer(r'mascot-\d+\.png', content))
    for i, m in enumerate(matches):
        start = max(0, m.start() - 50)
        end = min(len(content), m.end() + 50)
        print(f"Context {i}: ...{content[start:end]}...")

    # Find size-24 class context
    class_match = re.search(r'className:"[^"]*size-24[^"]*"', content)
    if class_match:
        print(f"Old Class found: {class_match.group(0)}")
    else:
        print("Old Class NOT found (size-24)")
        
    # Check for new class
    new_class_match = re.search(r'className:"[^"]*size-48[^"]*"', content)
    if new_class_match:
         print(f"New Class found: {new_class_match.group(0)}")

  except Exception as e:
    print(f"Error reading {target_file}: {e}")

  # 2. Check 2394 chunk
  chunk_path = os.path.join(base, "2394.4709e5215fe0c235.js")
  if os.path.exists(chunk_path):
      print(f"Chunk 2394 exists: {os.path.getsize(chunk_path)} bytes")
  else:
      print("Chunk 2394 MISSING")

  # 3. Check help.html CSS
  help_path = "/Users/abhinav/Downloads/Subtrack/Subtrack-main/help.html"
  try:
      with open(help_path, 'r') as f:
          h = f.read()
      if "help-onboarding-img" in h:
          print("CSS injected in help.html: YES")
      else:
          print("CSS injected in help.html: NO")
  except Exception as e:
      print(f"Error reading help.html: {e}")

if __name__ == "__main__":
    inspect()
