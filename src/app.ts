import * as http from "http";
import * as formidable from "formidable";
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
		console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
		const form = new formidable.IncomingForm();
		form.maxFieldsSize = 20 * 1024 * 1024;
		form.maxFileSize = 0;
		form.parse(req, function(err, fields) {
			if (err) {
				console.error(err);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ err }));
				return;
			}

			request.post(
				{
					headers: {
						"content-type": "application/json",
						Authorization: `token ${TOKEN}`,
						"User-Agent": "trycf-gist-server",
					},
					url: "https://api.github.com/gists",
					body: JSON.stringify(fields),
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
