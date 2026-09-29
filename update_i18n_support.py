import json
import os

en_path = "public/locales/english/translation.json"
hi_path = "public/locales/hindi/translation.json"

new_en = {
  "Support This Initiative →": "Support This Initiative →"
}

new_hi = {
  "Support This Initiative →": "इस पहल का समर्थन करें →"
}

def update_json(path, new_data):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {}
    
    data.update(new_data)
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {path}")

update_json(en_path, new_en)
update_json(hi_path, new_hi)
