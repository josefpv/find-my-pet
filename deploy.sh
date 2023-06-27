docker build -t josefvivas/find-my-pet-auth:latest -t josefvivas/find-my-pet-auth:$SHA -f ./auth/Dockerfile ./auth
docker build -t josefvivas/find-my-pet-event-bus:latest -t josefvivas/find-my-pet-event-bus:$SHA -f ./event-bus/Dockerfile ./event-bus
docker build -t josefvivas/find-my-pet-mascotas:latest -t josefvivas/find-my-pet-mascotas:$SHA -f ./mascotas/Dockerfile ./mascotas
docker build -t josefvivas/find-my-pet-qr:latest -t josefvivas/find-my-pet-qr:$SHA -f ./qr/Dockerfile ./qr
docker build -t josefvivas/find-my-pet-uploader:latest -t josefvivas/find-my-pet-uploader:$SHA -f ./uploader/Dockerfile ./uploader
docker build -t josefvivas/find-my-pet-web:latest -t josefvivas/find-my-pet-web:$SHA -f ./web/Dockerfile ./web

docker push josefvivas/find-my-pet-auth:latest
docker push josefvivas/find-my-pet-event-bus:latest
docker push josefvivas/find-my-pet-mascotas:latest 
docker push josefvivas/find-my-pet-qr:latest 
docker push josefvivas/find-my-pet-uploader:latest 
docker push josefvivas/find-my-pet-web:latest 

docker push josefvivas/find-my-pet-auth:$SHA
docker push josefvivas/find-my-pet-event-bus:$SHA
docker push josefvivas/find-my-pet-mascotas:$SHA 
docker push josefvivas/find-my-pet-qr:$SHA 
docker push josefvivas/find-my-pet-uploader:$SHA 
docker push josefvivas/find-my-pet-web:$SHA 


kubectl apply -f k8s

kubectl set image deployments/auth-deployment auth=josefvivas/find-my-pet-auth:$SHA
kubectl set image deployments/event-bus-deployment event-bus=josefvivas/find-my-pet-event-bus:$SHA
kubectl set image deployments/mascotas-deployment mascotas=josefvivas/find-my-pet-mascotas:$SHA
kubectl set image deployments/qr-deployment qr=josefvivas/find-my-pet-qr:$SHA
kubectl set image deployments/uploader-deployment uploader=josefvivas/find-my-pet-uploader:$SHA
kubectl set image deployments/web-deployment web=josefvivas/find-my-pet-web:$SHA