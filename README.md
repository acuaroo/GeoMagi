# GeoMagi

> *LLM finetuned on data about geomagnetism*

---

![gmvsgpt2-cropped](https://user-images.githubusercontent.com/67112172/234118695-aa479468-1e3a-461b-b8f4-9c16c853ee02.gif)

---

## Data Collection

`./extension/` can be loaded into the browser

Users can then use the extension to record viable webpages, along with what tag the page uses to store it's primary content (e.g. span for `<span>`)

Users can export their data to a `.json` file, which can then go to `./data-generation/collected/`

> ![](assets/geomagi-sample.png)

From there, `merge.py` merges all the data into one `scrape-list.json` *[`python merge.py`]*

Finally, `scrape.js` loops through the data and produces `data.txt` *[`npm i && npm run scrape`]*
