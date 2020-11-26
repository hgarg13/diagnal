# DIAGNAL Assignment

## Tech

* Node.js
* Express

## Installation

Install the dependencies and devDependencies and start the server.
```sh
$ cd diagnl
$ npm install
$ node ./bin/www
````


## APIS

### 1. scrape

It will take an endpoint in payload and parse metadata from that endpoint. If the page has OG parameters set exclusively, it returns all the OG parameters. If they are not set parse web page to fetch relevant details.

**URL** : `http://localhost:8000/scrape`

**Method** : `POST`
**Body** : {
	"url": "https://www.amazon.in/OnePlus-Mirror-Black-128GB-Storage/dp/B085J19V4P/ref=sr_1_1?dchild=1&pf_rd_i=22301453031&pf_rd_m=A1K21FY43GMZF8&pf_rd_p=438f39fc-fbe7-4036-8c3f-70d8762bd6ba&pf_rd_r=JY5G0GS5Q83J8F2C4G26&pf_rd_s=merchandised-search-2&pf_rd_t=101&qid=1606375071&sr=8-1"
}