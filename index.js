const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "*"
}));


app.get('/', async(req, res) => {
    try {
        // fetching Profile URL from Query Parameters
        if (req.query.city) {
            const city = req.query.city;
            const url = `https://news.google.com/search?q=${city} when:23h&hl=en-IN&gl=IN&ceid=IN:en`;
            // i(url.substring(0, 8));
            // console.log(url.substring(0, 8));
            // Fetch HTML of the Page
            const { data } = await axios.get(url);
            // Parse fetched HTML
            const $ = cheerio.load(data);
            var headline = [];
            const darta = $(".NiLAwe").each((idx, el) => {
                const title = $(el).find("h3").children("a").text();
                const link = $(el).find("article").children("a").attr("href");
                const img = $(el).find("img").attr("src");
                const source = $(el).find(".SVJrMe").children("a").first().text();
                const time = $(el).find(".SVJrMe").children("time").first().text();

                headline.push({
                    index: idx,
                    title: title,
                    link: `https://news.google.com${link.substring(1)}`,
                    img: img,
                    source: source,
                    time: time
                });
            });
            res.send(headline);
        } else {
            res.send({
                "response": "error",
                "message": "Provide Qwiklabs URL in the Query Parameter of the URL /?url=https://www.qwiklabs.com/public_profiles/xxxx-xxx-xxxx-xxx"
            });
        }
    } catch (error) {
        console.error(error);
    }
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));