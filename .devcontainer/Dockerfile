################################################################################
# Base
#  - a single-version python slim-bullseye image
# Installs
#  - uv (system-wide, via pip)
#  - adds a user called 'zen'
# Size
#  - 300MB
################################################################################


ARG PYTHON_VERSION=3.10
ARG DEBIAN_VERSION=bullseye

ARG NAME=py-trees-js

FROM python:${PYTHON_VERSION}-slim-${DEBIAN_VERSION}
# FROM ubuntu:20.04

################################################################################
# Debs
################################################################################

####################
# Core
####################
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3-dev \
    # pytrees
    graphviz \
    # development
    bash \
    bash-completion \
    ca-certificates \
    git \
    less \
    make \
    ssh \
    vim \
    wget

####################
# OpenGL
####################
# mesa-utils : glxgears + gl libs (libgl# libglvnd#, libglx#)
# egl: not needed (libegl1, libgles2)
# vulkan: not needed
RUN apt-get install -y --no-install-recommends \
    mesa-utils

####################
# Qt5 webengine
####################
# Should just install pyqt5webengine from debs instead?
RUN apt-get install -y --no-install-recommends \
    libasound2 \
    libdbus-1-dev \
    libgl1 \
    libnss3 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxkbcommon0 \
    libxkbcommon-x11-0 \
    libxrandr2 \
    libxtst6

################################################################################
# uv
################################################################################

RUN pip install --no-cache-dir uv

################################################################################
# NVIDIA
################################################################################

ENV NVIDIA_VISIBLE_DEVICES ${NVIDIA_VISIBLE_DEVICES:-all}
ENV NVIDIA_DRIVER_CAPABILITIES ${NVIDIA_DRIVER_CAPABILITIES:+$NVIDIA_DRIVER_CAPABILITIES,}graphics,display,video,utility,compute

################################################################################
# Login Shells for Debugging & Development
################################################################################

ENV TERM xterm-256color
ENTRYPOINT ["/bin/bash", "--login", "-i"]

################################################################################
# Development with a user, e.g. for vscode devcontainers
################################################################################

ARG USERNAME=zen
ARG USER_UID=1001
ARG USER_GID=${USER_UID}

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -s "/bin/bash" -m $USERNAME && \
    apt-get install -y sudo && \
    echo "${USERNAME} ALL=NOPASSWD: ALL" > /etc/sudoers.d/${USERNAME} && \
    chmod 0440 /etc/sudoers.d/${USERNAME}
RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@${NAME}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> /home/${USERNAME}/.bashrc && \
    echo "alias ll='ls --color=auto -alFNh'" >> /home/${USERNAME}/.bashrc && \
    echo "alias ls='ls --color=auto -Nh'" >> /home/${USERNAME}/.bashrc

#    touch /home/${USERNAME}/.bash_completion && chown ${USERNAME}:${USERNAME} /home/${USERNAME}/.bash_completion

################################################################################
# Debugging with root
################################################################################

RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@${NAME}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> ${HOME}/.bashrc && \
    echo "alias ll='ls --color=auto -alFNh'" >> ${HOME}/.bashrc && \
    echo "alias ls='ls --color=auto -Nh'" >> ${HOME}/.bashrc
