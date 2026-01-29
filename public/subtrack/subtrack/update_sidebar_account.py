
import os
import re

HELP_DIR = '/Users/abhinav/Downloads/Subtrack/Subtrack-main/help'

NEW_LINKS_BASE = [
    ('Data Privacy and Security', 'account/data-privacy-and-security.html'),
    ('Setting Your Timezone', 'account/setting-your-timezone.html'),
    ('Setting Your Base Currency', 'account/setting-base-currency.html'),
    ('Notification Settings', 'account/notification-settings.html')
]

def get_relative_path(current_file_path, target_relative_to_help):
    current_dir = os.path.dirname(current_file_path)
    target_abs = os.path.join(HELP_DIR, target_relative_to_help)
    rel_path = os.path.relpath(target_abs, current_dir)
    return rel_path

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find the Account & Security list item.
    # Handles multi-line attributes and content.
    # Captures:
    # 1. The <li> and the <button> part up to </button>
    # 2. Any existing content (like a previous <ul>) before the closing </li>
    # 3. The closing </li>
    
    pattern = r'(<li>\s*<button[^>]*?>\s*<span>\s*Account\s*&amp;\s*Security\s*</span>[\s\S]*?<\/button>)([\s\S]*?)(<\/li>)'
    
    match = re.search(pattern, content, re.IGNORECASE)
    if not match:
        print(f"Skipping {file_path}: Pattern not found")
        return

    button_part = match.group(1)
    existing_list = match.group(2)
    closing_li = match.group(3)

    # If we already have the specific links, maybe we should check?
    # But for now, let's just forcefuly overwrite the list part.
    
    # Generate new links HTML
    links_html = '\n<ul class="mt-1 space-y-1 px-2">\n'
    for title, target in NEW_LINKS_BASE:
        rel_link = get_relative_path(file_path, target)
        links_html += f'  <li><a class="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground" href="{rel_link}">{title}</a></li>\n'
    links_html += '</ul>\n'
    
    replacement = button_part + links_html + closing_li
    
    # Only write if different (ignoring whitespace differences might be good, but direct string comparison is safer)
    if replacement != match.group(0):
        # We replace the *entire match* with constructed string
        new_content = content[:match.start()] + replacement + content[match.end():]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        # If the content matches exactly what we generated, no need to write.
        # But if `existing_list` was different (e.g. empty), `replacement` will correspond to new list.
        # If `existing_list` was ALREADY the new list, `replacement` == `match.group(0)`.
        print(f"No change needed for {file_path}")

def main():
    for root, dirs, files in os.walk(HELP_DIR):
        for file in files:
            if file.endswith(".html"):
                update_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
