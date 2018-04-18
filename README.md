### to build
docker build -t ryanguill/trycf-gist-server:0.0.1 .

### to run
docker run -d -p 3000:3000 -e "TOKEN={your token here}" --name trycf-gist-server ryanguill/trycf-gist-server:0.0.1

### to monitor logs
docker logs -f trycf-gist-server

### to stop
docker stop trycf-gist-server && docker rm trycf-gist-server