#!/usr/bin/env python3
"""
Script to inject Firebase authentication scripts into HTML files
and remove old mock-auth scripts
"""

import re

def inject_firebase_into_login():
    """Inject Firebase scripts into login.html"""
    with open('login.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove old mock auth scripts
    content = re.sub(r'<script src="mock-auth\.js"></script>', '', content)
    content = re.sub(r'<script src="login-handler\.js"></script>', '', content)
    
    # Firebase scripts to inject (ESM modules)
    firebase_scripts = '''
<!-- Firebase Authentication Scripts -->
<script type="module" src="firebase-config.js"></script>
<script type="module" src="firebase-auth-login.js"></script>
'''
    
    # Inject before </head>
    content = content.replace('</head>', f'{firebase_scripts}</head>')
    
    with open('login.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ Injected Firebase scripts into login.html')

def inject_firebase_into_register():
    """Inject Firebase scripts into register.html"""
    with open('register.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove old mock auth scripts
    content = re.sub(r'<script src="mock-auth\.js"></script>', '', content)
    content = re.sub(r'<script src="register-handler\.js"></script>', '', content)
    
    # Firebase scripts to inject (ESM modules)
    firebase_scripts = '''
<!-- Firebase Authentication Scripts -->
<script type="module" src="firebase-config.js"></script>
<script type="module" src="firebase-auth-register.js"></script>
'''
    
    # Inject before </head>
    content = content.replace('</head>', f'{firebase_scripts}</head>')
    
    with open('register.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ Injected Firebase scripts into register.html')

def inject_firebase_into_dashboard():
    """Inject Firebase auth guard into dashboard.html"""
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove old mock auth scripts if present
    content = re.sub(r'<script src="mock-auth\.js"></script>', '', content)
    content = re.sub(r'<script src="login-handler\.js"></script>', '', content)
    
    # Firebase scripts to inject (ESM modules)
    firebase_scripts = '''
<!-- Firebase Authentication Guard -->
<script type="module" src="firebase-config.js"></script>
<script type="module" src="firebase-auth-guard.js"></script>
'''
    
    # Inject before </head>
    if firebase_scripts.strip() not in content:
        content = content.replace('</head>', f'{firebase_scripts}</head>')
    
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ Injected Firebase auth guard into dashboard.html')

if __name__ == '__main__':
    inject_firebase_into_login()
    inject_firebase_into_register()
    inject_firebase_into_dashboard()
    print('\n🎉 Firebase authentication scripts injected successfully!')
    print('\n⚠️  IMPORTANT: Update firebase-config.js with your Firebase project credentials')
