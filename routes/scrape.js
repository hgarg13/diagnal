const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.post('/', (req, res, next) => {
	if (req.body.url) {
		request({ uri: req.body.url }, async (error, response, body) => {
			try {
				const $ = await cheerio.load(body);
				const meta = $('meta');
				const keys = Object.keys(meta);
				if (keys.length !== 0) {
					let ogProps = {};
					/**
					 * Get all the OG parameters if they are set exclusively on the page
					 */
					ogProps = getOgParameters(meta, keys, ogProps);
					/**
					 * Get the parameters in case og parameters are not set exclusively by parsing the webpage
					 */
					if (Object.keys(ogProps).length === 0) {
						ogProps = getNonOgParameters(meta, keys, ogProps);
					}
					if (Object.keys(ogProps).length === 0) {
						return res.status(400).send('No meta properties found for web scraping');
					}
					return res.status(200).send(ogProps)
				} else {
					res.status(400).send('No meta properties found for web scraping');
				}
			} catch (error) {
				res.status(404).send(error.message);
			}
		});
	} else {
		res.status(400).send('Please provide a valid url');
	}
});

/**
 * 
 * @param {*} meta 
 * @param {*} keys 
 * @param {*} ogProps 
 */
function getOgParameters(meta, keys, ogProps) {
	const regx = new RegExp(/^og:/);
	keys.forEach((key) => {
		if (meta[key].attribs && meta[key].attribs.property && regx.test(meta[key].attribs.property)) {
			let k = meta[key].attribs.property.split(':')[1];
			if (k == 'image') {
				ogProps[k] = ogProps[k] || [];
				ogProps[k].push(meta[key].attribs.content);
			} else {
				ogProps[k] = meta[key].attribs.content;
			}
		}
	});
	return ogProps;
}

/**
 * 
 * @param {*} meta 
 * @param {*} keys 
 * @param {*} ogProps 
 */

function getNonOgParameters(meta, keys, ogProps) {
	keys.forEach((key) => {
		if (meta[key].attribs && meta[key].attribs.name) {
			if (meta[key].attribs.name == 'image') {
				ogProps[meta[key].attribs.name] = ogProps[meta[key].attribs.name] || [];
				ogProps[meta[key].attribs.name].push(meta[key].attribs.content);
			} else {
				ogProps[meta[key].attribs.name] = meta[key].attribs.content;
			}
		}
	});
	return ogProps;
}
module.exports = router;