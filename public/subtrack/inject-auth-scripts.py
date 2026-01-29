#!/usr/bin/env python3
"""
Inject mock auth scripts into login and register pages
"""

import re

def inject_scripts_into_html(file_path, scripts_to_inject):
    """Inject script tags before </head> in HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create script tags
    script_tags = '\n'.join(f'<script src="{script}"></script>' for script in scripts_to_inject)
    
    # Inject before </head>
    content = content.replace('</head>', f'{script_tags}</head>')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ Injected {len(scripts_to_inject)} scripts into {file_path}')

# Inject into login.html
inject_scripts_into_html(
    'login.html',
    ['mock-auth.js', 'login-handler.js']
)

# Inject into register.html
inject_scripts_into_html(
    'register.html',
    ['mock-auth.js', 'register-handler.js']
)

print('\n✨ All scripts injected successfully!')
