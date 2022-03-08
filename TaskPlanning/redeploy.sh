#docker ps | grep food-base-web | awk '{print $1}' | xargs docker stop
docker-compose down
docker image rm -f food-base-web_food-base-web

git pull

if [ $1 = 'react' ]
then
	echo 'compile react app'
	#compile react app
	cd static/ner
	npm install
	npm run-script build
	rm -rf node_modules
	cd ../../
fi

#docker build -t food-base-web:latest .
#docker run -d -p 5000:5000 food-base-web
docker-compose  up -d
echo "Docker id: "
docker ps | grep food-base-web | awk '{print $1}'
echo "Logs: "
docker ps | grep food-base-web | awk '{print $1}' | xargs docker logs -f