import StatusCode from '../utils/StatusCode'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import Logger from '../utils/Logger'
import { JSDOM } from 'jsdom'

import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const parseUrl = (request: Request, response: Response) => {

	const url = request.body.urlToParse
	try {
		function fetchPage(url: string): Promise<string | undefined> {
			const HTMLData = axios
				.get(url)
				.then(res => res.data)
				.catch((error: AxiosError) => {
					console.error(`There was an error with ${error.config.url}.`);
					console.error(error.toJSON());
				});

			return HTMLData;
		}

		async function fetchFromWebOrCache(url: string, ignoreCache = false) {
			// If the cache folder doesn't exist, create it
			if (!existsSync(resolve(__dirname, '../cache'))) {
				mkdirSync('../cache');
			}
			console.log(`Getting data for ${url}...`);
			if (
				!ignoreCache &&
				existsSync(
					resolve(__dirname, `../cache/${Buffer.from(url).toString('base64')}.html`),
				)
			) {
				console.log(`I read ${url} from cache`);
				const HTMLData = await readFile(
					resolve(__dirname, `../cache/${Buffer.from(url).toString('base64')}.html`),
					{ encoding: 'utf8' },
				);
				const dom = new JSDOM(HTMLData);
				return dom.window.document;
			} else {
				console.log(`I fetched ${url} fresh`);
				const HTMLData = await fetchPage(url);
				if (!ignoreCache && HTMLData) {
					writeFile(
						resolve(
							__dirname,
							`.cache/${Buffer.from(url).toString('base64')}.html`,
						),
						HTMLData,
						{ encoding: 'utf8' },
					);
				}
				const dom = new JSDOM(HTMLData);
				return dom.window.document;
			}
		}

		function extractData(document: Document) {
			const writingLinks: HTMLAnchorElement[] = Array.from(
				document.querySelectorAll('a.titlelink'),
			);
			return writingLinks.map(link => {
				return {
					title: link.text,
					url: link.href,
				};
			});
		}

		// function saveData(filename: string, data: any) {
		// 	if (!existsSync(resolve(__dirname, 'data'))) {
		// 		mkdirSync('data');
		// 	}
		// 	writeFile(resolve(__dirname, `../../data/${filename}.json`), JSON.stringify(data), {
		// 		encoding: 'utf8',
		// 	});
		// 	return data;
		// }

		async function getData() {
			const document = await fetchFromWebOrCache(
				'https://news.ycombinator.com/',
				true,
			);
			const data = extractData(document);
			const dataToSend = {'hacker-news-links': data}
			return dataToSend
		}

		const data = getData();
		Logger.info(data)
		// if (data !== Promise {
		response.status(StatusCode.OK).json(data)
	} catch (error) {
		Logger.error(error)
		response.status(StatusCode.INTERNAL_SERVER_ERROR).send(error)
	}
}

export default {
	parseUrl
}