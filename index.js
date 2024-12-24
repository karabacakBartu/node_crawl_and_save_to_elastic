const axios = require("axios");
const cheerio = require("cheerio");
const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({ node: "http://127.0.0.1:9200" });

const baseURL = "https://www.sozcu.com.tr";

async function crawlSozcu() {
  try {
    const response = await axios.get(baseURL);
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = await crawlLink($);

    const filteredArticles = articles.filter((article) => article.title);

    console.log("Crawled articles:", filteredArticles);

    await saveToElasticsearch(filteredArticles);
  } catch (error) {
    console.error("Something went wrong:", error.message);
  }
}

crawlSozcu();

async function crawlLink($) {
  const articles = [];
  $(".news-card a").each((index, element) => {
    const title =
      $(element).attr("title") || $(element).find("img").attr("alt");
    const url = $(element).attr("href");
    const img = $(element).find("img").attr("src");

    articles.push({
      title: title ? title.trim() : null,
      url: url.startsWith("http") ? url : baseURL + url,
      img: img ? (img.startsWith("http") ? img : baseURL + img) : null,
    });
  });

  return articles;
}

async function saveToElasticsearch(news) {
  try {
    for (const element of news) {
      await esClient.index({
        index: "sozcu-news",
        document: element,
      });
    }
    console.log("Successfully saved.");
  } catch (error) {
    console.error(
      "Error occurred while saving data to Elasticsearch:",
      error.message
    );
  }
}

//Toplu veri silme

/*async function deleteAllFromElasticsearch(indexName) {
    try {
      const response = await esClient.deleteByQuery({
        index: indexName, 
        query: {
          match_all: {}, 
        },
      });
      console.log(`Deleted: ${indexName}`, response);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  // Kullanım:
  deleteAllFromElasticsearch("sozcu-news"); 
