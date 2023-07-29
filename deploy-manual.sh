docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-auth -f ./auth/Dockerfile ./auth --push
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-event-bus -f ./event-bus/Dockerfile ./event-bus --push
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-mascotas -f ./mascotas/Dockerfile ./mascotas --push
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-qr -f ./qr/Dockerfile ./qr --push
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-uploader -f ./uploader/Dockerfile ./uploader --push
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t josefvivas/fmp-web -f ./web/Dockerfile ./web --push