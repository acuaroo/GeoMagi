import os
import json
import re

full_data = []
unique_urls = set()

for filename in os.listdir('collected'):
    with open(os.path.join('collected', filename)) as json_file:
        data = json.load(json_file)
        full_data.append(data)


for data in full_data:
    for item in data:
        current_url = item['currentUrl']
        domain_name = re.search('^https?://(?:www\.)?([^:/]+)', current_url).group(1)
        unique_urls.add(domain_name)

print("unique urls: ")
print(unique_urls)

with open('scrape-list.json', 'w') as json_file:
    json.dump(full_data, json_file, indent=2)
