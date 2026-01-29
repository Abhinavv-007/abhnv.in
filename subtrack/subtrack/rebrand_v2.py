import os

# Configuration
replacements = {
    'Vexly': 'SubTrack',
    'vexly': 'subtrack', # Be careful with this one, maybe case dependent?
    'subtrack.app': 'subtrack.abhnv.in',
    'support@vexly.app': 'support@abhnv.in',
    'support@subtrack.app': 'support@abhnv.in',
    'hoangvu12': 'Abhinav Raj',
    '@hoangvu12': '@abhnv07',
    'Discord': 'LinkedIn', # Context-aware replacement might be better, but acceptable for footer text
    'href="https://discord.gg/your-invite-code"': 'href="https://www.linkedin.com/in/abhnv07/"', # Example discord link
    'href="https://discord.gg/vexly"': 'href="https://www.linkedin.com/in/abhnv07/"',
}

# Target file extensions
extensions = ['.html', '.js', '.json', '.md']

# Root directory
root_dir = '/Users/abhinav/Downloads/Subtrack/Subtrack-main'

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply strict replacements first
        content = content.replace('subtrack.app', 'subtrack.abhnv.in')
        content = content.replace('support@vexly.app', 'support@abhnv.in')
        content = content.replace('support@subtrack.app', 'support@abhnv.in')
        content = content.replace('Vexly', 'SubTrack')
        
        # Author updates
        content = content.replace('hoangvu12', 'Abhinav Raj')
        content = content.replace('content="hoangvu12"', 'content="Abhinav Raj"')
        
        # Discord Removal / Replacement
        # Targeted replacement for common footer structure
        if 'Discord' in content:
            # Replace Discord text with LinkedIn if it's a link label
            content = content.replace('>Discord<', '>LinkedIn<')
            content = content.replace('alt="Discord"', 'alt="LinkedIn"')
        
        # Remove specific Discord links if found known
        # We might need to manually check some, but this helps
        
        if content != original_content:
            print(f"Modifying: {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
    return False

# Main loop
count = 0
for subdir, dirs, files in os.walk(root_dir):
    if '.git' in subdir or 'node_modules' in subdir or '.next' in subdir:
        continue
    
    for file in files:
        if any(file.endswith(ext) for ext in extensions):
            filepath = os.path.join(subdir, file)
            if process_file(filepath):
                count += 1

print(f"Total files modified: {count}")
