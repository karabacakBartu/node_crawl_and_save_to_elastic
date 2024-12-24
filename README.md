# Sözcü Article Crawler

This project is a web scraping application that crawls news articles from the Sözcü website and stores them in an Elasticsearch index. It uses `axios` for HTTP requests, `cheerio` for HTML parsing, and the Elasticsearch Node.js client for interacting with Elasticsearch.

---

## Features
- Crawls news articles from the [Sözcü](https://www.sozcu.com.tr/) homepage.
- Extracts article titles, URLs, and image URLs.
- Saves the crawled articles to Elasticsearch.
- Provides functionality for bulk deletion of data from the Elasticsearch index.

---

## Technologies Used
- **Node.js**: Backend runtime.
- **axios**: For HTTP requests.
- **cheerio**: For HTML parsing and web scraping.
- **@elastic/elasticsearch**: Elasticsearch client for Node.js.

---

## Prerequisites

1. **Node.js**: Ensure Node.js is installed. You can download it [here](https://nodejs.org/).
2. **Elasticsearch**: Make sure Elasticsearch is installed and running. Default connection URL: `http://127.0.0.1:9200`.
3. **npm/yarn**: Package manager to install dependencies.

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sozcu-news-crawler.git
   cd sozcu-news-crawler
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
## Usage

### Crawling News Articles
Run the main script to scrape articles and store them in Elasticsearch:
```bash
   first step: docker-compose up
   
   second step: node index.js
```
---

## Error Handling
- **Network Errors**: If the script cannot connect to the Sözcü website or Elasticsearch, ensure the respective services are accessible.
- **Data Saving Issues**: Check Elasticsearch logs for potential indexing issues.

---
