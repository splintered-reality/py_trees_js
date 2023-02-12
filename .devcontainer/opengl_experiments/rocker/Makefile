TAG=bar

# Private variables
REPO=devel

help:
	@echo "Usage:"
	@echo ""
	@echo "  image     : build an image"
	@echo "  container : create a container that persists"
	@echo "  start     : execute from the container"
	@echo "  clean     : clean up container"
	@echo "  pristine  : clean image and container"
	@echo ""
	@echo "Be Froody."

image:
	docker build \
	  --build-arg POETRY_VERSION=1.3.2 \
	  --build-arg PYTHON_VERSION=3.8.16 \
	  --build-arg DEBIAN_VERSION=bullseye \
	  --build-arg NAME=${TAG} \
	  -t ${REPO}:${TAG} .

container:
	docker container create --tty --network host -i --gpus 'all,"capabilities=graphics,utility,display,video,compute"' -v /tmp/.X11-unix:/tmp/.X11-unix:ro -e DISPLAY --name=${TAG} ${REPO}:${TAG}

run: clean
	docker run -it --mount type=bind,source=/mnt/mervin/workspaces/foo,target=/mnt/foo --name=${TAG} --network host --gpus 'all,"capabilities=graphics,utility,display,video,compute"' --volume /tmp/.X11-unix:/tmp/.X11-unix:ro --env DISPLAY ${REPO}:${TAG} /bin/bash --login -i
# docker run -it --mount type=bind,source=/mnt/mervin/workspaces/foo,target=/mnt/foo 
# --name foo  -v /home/danielstonier/.gitconfig:/home/danielstonier/.gitconfig:ro
# --network host  
# --gpus 'all,"capabilities=graphics,utility,display,video,compute"' 
#--volume /tmp/.X11-unix:/tmp/.X11-unix:ro --env=DISPLAY devel:foo /bin/bash --login -i

start:
	docker container start -i ${TAG}

clean:
	-docker container rm ${TAG}

pristine: clean
	docker image rm ${REPO}:${TAG}
