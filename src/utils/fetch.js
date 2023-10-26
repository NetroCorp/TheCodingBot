/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Fetch",
		description: "Fetches things."
	};
};

const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

module.exports = (app) => {
	return {
		meta,
		execute: fetch
	}
};