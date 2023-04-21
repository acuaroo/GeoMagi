import os
import json

full_data = []

for filename in os.listdir('collected'):
    with open(os.path.join('collected', filename)) as json_file:
        data = json.load(json_file)
        full_data.append(data)

with open('scrape-list.json', 'w') as json_file:
    json.dump(full_data, json_file, indent=2)
