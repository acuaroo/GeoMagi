import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

let data = fs.readFileSync("scrape-list.json", "utf8")
let websites = Object.values(JSON.parse(data));

let scraped = [];
let textData = [];

let totalWords = 0;

function scrape(website, url) {
    axios(url)
        .then(response => {
            if (scraped.includes(url)) return;
            scraped.push(url);

            const html = response.data;
            const $ = cheerio.load(html);
            const paragraphs = $(website.search);

            paragraphs.each(function() {
                const text = $(this).text();
                const words = text.split(/\s+/).length;
                
                if (words > website.limit && !text.includes("...")) {
                    if (textData.includes(text)) return;
                    totalWords += words
                    console.log(text);
                    textData.push(text);
                }
            });
        }).catch(console.error);
}

let totalUrls = 0;

websites.forEach(website => {
    let urls = Object.values(website.urls);

    urls.forEach(url => {
        totalUrls += 1;
        scrape(website, url);
    });
});

let waitTime = totalUrls * 1000;

setTimeout(() => {
    let writeData = JSON.stringify(textData, null, 1);
    writeData = writeData.substring(1, writeData.length - 1);

    writeData = writeData.replace(/\"/g, "");
    writeData = writeData.replace(/\t/g, "");
    writeData = writeData.replace(/\n\n/g, "\n");
    writeData = writeData.replace(/,\n/g, "\n");

    console.log("total words: " + totalWords);

    fs.writeFileSync("data.txt", writeData, "utf8");
}, waitTime);