import * as http from "http";
import * as request from "request";

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

if (TOKEN === undefined) {
	console.error("You must provide the TOKEN environment variable.");
	process.exit(1);
}

const server = http.createServer().listen(PORT);

server.on("request", function(req, res) {
	if (req.url == "/gists" && req.method.toLowerCase() == "post") {
		let data = "";
		req.on("data", function(chunk: string) {
			data += chunk;
		});

		req.on("end", function() {
			console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
			request.post(
				{
					headers: {
						"content-type": "application/json",
						Authorization: `token ${TOKEN}`,
						"User-Agent": "trycf-gist-server",
					},
					url: "https://api.github.com/gists",
					body: data,
				},
				function(error, response, body) {
					try {
						const responseData = JSON.parse(body);
						let gist_url = "";
						if (responseData.html_url) {
							gist_url = responseData.html_url;
						}
						console.log(`gist api response: ${gist_url} ${new Date().toISOString()}`);
					} catch {
						//intentionally ignore
					}

					res.writeHead(response.statusCode, response.headers);
					res.end(body);
				},
			);
		});
	} else {
		console.log(`${req.method} ${req.url} 404 ${new Date().toISOString()}`);
		res.writeHead(404);
		res.end("The only valid path is POST /gists");
	}
});

console.log(`Server is listening on port ${PORT}`);
