const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let data = fs.readFileSync("scrape-list.json", "utf8")
let websites = Object.values(JSON.parse(data));

async function scrape(website) {
    axios(website.url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const paragraphs = $(website.search);

            paragraphs.each(function() {
                const text = $(this).text();
                const words = text.split(/\s+/).length;
                
                if (words > website.limit) {
                    console.log(text);
                }
            });

        }).catch(console.error);
}

websites.forEach(website => {
    scrape(website);
});