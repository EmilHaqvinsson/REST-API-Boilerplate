// import StatusCode from '../utils/StatusCode'
// import { Request, Response } from 'express'
// import axios, { AxiosError } from 'axios'
// import Logger from '../utils/Logger'
// import { JSDOM } from 'jsdom'

// import { existsSync, mkdirSync } from 'fs';
// import { readFile, writeFile } from 'fs/promises';
// import { resolve } from 'path';

// const parseUrl = async (request: Request, response: Response) => {
// 	const url = request.body.urlToParse
// 	//  function getHtml(url: string) {
// 		async function fetchFromWebOrCache(url: string, ignoreCache = false) {
// 			// If the cache folder doesn't exist, create it
// 			// if (!existsSync(resolve(__dirname, '../cache'))) {
// 			// 	mkdirSync('../cache');
// 			// }
// 			console.log(`Getting data for ${url}...`);
// 			// if (
// 			// 	!ignoreCache &&
// 			// 	existsSync(
// 			// 		resolve(__dirname, `../cache/${Buffer.from(url).toString('base64')}.html`),
// 			// 	)
// 			// ) {
// 			// 	console.log(`I read ${url} from cache`);
// 			// 	const HTMLData = await readFile(
// 			// 		resolve(__dirname, `../cache/${Buffer.from(url).toString('base64')}.html`),
// 			// 		{ encoding: 'utf8' },
// 			// 	);
// 			// 	return HTMLData;
// 			// } else {
// 				console.log(`I fetched ${url} fresh`);
// 				const HTMLData = await fetchPage(url);
// 				if (HTMLData) {
// 					writeFile(
// 						resolve(
// 							__dirname,
// 							`../cache/${Buffer.from(url).toString('base64')}.html`,
// 						),
// 						HTMLData,
// 						{ encoding: 'utf8' },
// 					);
// 					const HTMLData = '<html>...</html>'
// 				}
// 			const dom = new JSDOM(HTMLData);
// 			return dom.window.document;
// 		}

// 		function fetchPage(url: string): Promise<string | undefined> {
// 			const HTMLData = axios
// 				.get(url)
// 				.then(res => res.data)
// 				.catch((error: AxiosError) => {
// 					console.error(`There was an error with ${error.config.url}.`);
// 					console.error(error.toJSON());
// 				});

// 			return HTMLData;
// 		}
		
// 		const document = await fetchFromWebOrCache(url);
		
// 		function extractData(document: Document) {
// 			const videoDivs: HTMLDivElement[] = Array.from(
// 				document.querySelectorAll('div.ugrid_i'),
// 			);
// 			return videoDivs.map(div => {
// 				return {
// 					videoDivs: div.innerHTML
// 				};
// 			});
// 		}

// 		const data = extractData(document)
// 				response.status(StatusCode.OK).send(data)
// }

	export default {
		
	}