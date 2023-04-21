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
            const $ = cheerio.load(html);
            const paragraphs = $(search);

            paragraphs.each(function() {
                const text = $(this).text();
                const words = text.split(/\s+/).length;
                
                if (words > limit && !text.includes("...")) {
                    if (textData.includes(text)) return;
                    totalWords += words
                    console.log(text);
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

Promise.all(scrapePromises).then(() => {
    let writeData = JSON.stringify(textData, null, 1);
    writeData = writeData.substring(1, writeData.length - 1);

    writeData = writeData.replace(/\"/g, "");
    writeData = writeData.replace(/\\t/g, "");
    writeData = writeData.replace(/\\n/g, "");

    writeData = writeData.trim();
    
    console.log("total words: " + totalWords);

    fs.writeFileSync("data.txt", writeData, "utf8");
}).catch(console.error);
