import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

let data = fs.readFileSync("scrape-list.json", "utf8")
let websites = Object.values(JSON.parse(data));

let scraped = [];
let textData = [];

let totalWords = 0;
let limit = 30;

function scrape(url, search) {
    return axios(url)
        .then(response => {
            if (scraped.includes(url)) return;
            scraped.push(url);

            const html = response.data;

            // note: deprecated
            const $ = cheerio.load(html);
            const paragraphs = $(search);

            paragraphs.each(function() {
                const text = $(this).text();
                const words = text.split(/\s+/).length;
                
                // ... is to remove article summaries, as no
                // actual text will have that.
                
                if (words > limit && !text.includes("...")) {
                    if (textData.includes(text)) return;
                    totalWords += words

                    //console.log(text);
                    textData.push(text);
                }
            });
        }).catch(console.error);
}

let scrapePromises = [];

websites.forEach(files => {
    files = Object.values(files)

    files.forEach(website => {
        scrapePromises.push(scrape(website.currentUrl, website.text));
    });
});

let report = fs.readFileSync("WMM2020_Report.txt", "utf8");
let reportWords = report.split(/\s+/).length;

totalWords += reportWords;
textData.push(report);


Promise.all(scrapePromises).then(() => {
    let writeData = JSON.stringify(textData, null, 1);
    writeData = writeData.substring(1, writeData.length - 1);

    // remove quotes, tabs, and newlines
    writeData = writeData.replace(/\"/g, "");
    writeData = writeData.replace(/\\t/g, "");
    writeData = writeData.replace(/\\n/g, "");

    // every 200 words, force break into a new line
    writeData = writeData.replace(/(.{200}\s)/g, "$1\n")
    writeData = writeData.replace(/^\s*[\r]/gm, "");

    writeData = writeData.trim();

    console.log("estimated words (does not account for \\n or \\t): " + totalWords);

    fs.writeFileSync("data.txt", writeData, "utf8");
}).catch(console.error);
