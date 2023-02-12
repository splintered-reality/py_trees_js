TAG=original
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
	docker container create --tty --network host -i --gpus all -v /tmp/.X11-unix:/tmp/.X11-unix:ro -e DISPLAY --name=${TAG} ${REPO}:${TAG}

run: clean
	docker run -it --mount type=bind,source=/mnt/mervin/workspaces/foo,target=/mnt/foo --name=${TAG} --network host --gpus all --volume /tmp/.X11-unix:/tmp/.X11-unix:ro --env DISPLAY --env NVIDIA_VISIBLE_DEVICES=all --env NVIDIA_DRIVER_CAPABILITIES=graphics,display,video,utility,compute --user zen ${REPO}:${TAG} -i

start:
	docker container start -i ${TAG}

clean:
	-docker container rm ${TAG}

pristine: clean
	docker image rm ${REPO}:${TAG}
