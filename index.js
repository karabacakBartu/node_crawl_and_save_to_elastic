const axios = require("axios");
const cheerio = require("cheerio");
const { Client } = require("@elastic/elasticsearch");

//const client = new Client({
//  node: "http://0.0.0.0:9200", // IPv4 adresi
//});

const esClient = new Client({ node: "http://127.0.0.1:9200" });

const baseURL = "https://www.sozcu.com.tr";

async function crawlSozcu() {
  try {
    const response = await axios.get(baseURL);
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = await crawlLink($);

    const filteredArticles = articles.filter((article) => article.title);

    console.log("Çekilen Haberler:", filteredArticles);

    await saveToElasticsearch(filteredArticles);
  } catch (error) {
    console.error("Crawl işlemi sırasında hata oluştu:", error.message);
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
      // Veriyi Elasticsearch'e kaydet
      await esClient.index({
        index: "sozcu-news", // Elasticsearch dizin adı
        document: element, // Kaydedilecek veri
      });
    }
    console.log("Veriler Elasticsearch'e kaydedildi!");
  } catch (error) {
    console.error(
      "Elasticsearch'e veri kaydedilirken hata oluştu:",
      error.message
    );
  }
}

//Toplu veri silme

/*async function deleteAllFromElasticsearch(indexName) {
    try {
      const response = await esClient.deleteByQuery({
        index: indexName, // Silmek istediğiniz dizin adı
        query: {
          match_all: {}, // Tüm dokümanları seçer
        },
      });
      console.log(`Dizindeki tüm veriler silindi: ${indexName}`, response);
    } catch (error) {
      console.error(
        `Elasticsearch'teki veriler silinirken hata oluştu (${indexName}):`,
        error.message
      );
    }
  }
  
  // Kullanım:
  deleteAllFromElasticsearch("sozcu-news"); // "sozcu-news" dizinindeki tüm verileri siler*/
