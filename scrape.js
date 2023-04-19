import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import urlExist from "url-exist";

let data = fs.readFileSync("scrape-list.json", "utf8")
let websites = Object.values(JSON.parse(data));

let scraped = [];
let textData = [];

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
                
                if (words > website.limit) {
                    if (textData.includes(text)) return;
                    console.log(text);
                    textData.push(text);
                }
            });

            const domain = url.match(/:\/\/(.[^/]+)/)[1];

            const links = $("a");
            let searchlim = website.searchlim;

            links.each(function() {
                if (searchlim == 0) return;
                
                searchlim--;

                let link = $(this).attr("href");
                if (link == undefined) return;

                if (link.startsWith("/")) {
                    link = domain + link;
                } 

                if (link.includes("mailto:")) return;
                if (link.includes("#")) return;
                if (link.includes("tel:")) return;

                if (!link.includes("https")) {
                    link = "https://" + link;
                }
                
                if (scraped.includes(link)) return;

                let valid = urlExist(link);

                if (valid) {
                    console.log("\x1b[34m%s\x1b[0m", link);
                    scraped.push(link);

                    scrape(website, link);
                }
            });

            return;

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
    let writeData = JSON.stringify(textData, null, 2);
    writeData = writeData.substring(1, writeData.length - 1);

    writeData = writeData.replace(/\"/g, "");
    writeData = writeData.replace(/\t/g, "");
    writeData = writeData.replace(/\n\n/g, "\n");
    writeData = writeData.replace(/,\n/g, "\n");

    fs.writeFileSync("data.txt", writeData, "utf8");
}, waitTime);