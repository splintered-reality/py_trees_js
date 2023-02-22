################################################################################
# Base
#  - a single-version python slim-bullseye image
# Installs
#  - poetry in /opt/poetry
#  - adds a user called 'zen'
# Size
#  - 300MB
################################################################################


ARG PYTHON_VERSION=3.8.15
ARG DEBIAN_VERSION=bullseye

ARG NAME=py-trees-js
ARG POETRY_VERSION=1.3.2

FROM python:${PYTHON_VERSION}-slim-${DEBIAN_VERSION}
# FROM ubuntu:20.04

ENV POETRY_HOME=/opt/poetry
ENV PATH="${POETRY_HOME}/bin:${PATH}"

################################################################################
# Debs
################################################################################

####################
# Core
####################
RUN apt-get update && apt-get install -y --no-install-recommends \
    # poetry
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
# Poetry
################################################################################

# Don't permit virtualenvs for root / ci jobs (this configuration).
# Do permit virtualenvs for user zen (uses the default).
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=${POETRY_VERSION} python3 - && \
    poetry config virtualenvs.create false && \
    poetry completions bash >> ~/.bash_completion


################################################################################
# NVIDIA
################################################################################

ENV NVIDIA_VISIBLE_DEVICES ${NVIDIA_VISIBLE_DEVICES:-all}
ENV NVIDIA_DRIVER_CAPABILITIES ${NVIDIA_DRIVER_CAPABILITIES:+$NVIDIA_DRIVER_CAPABILITIES,}graphics,display,video,utility,compute

################################################################################
# Login Shells for Debugging & Development
################################################################################

# In a login shell (below), the PATH env doesn't survive, configure it at ground zero
RUN echo "export PATH=${POETRY_HOME}/bin:${PATH}" >> /etc/profile
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
    echo "alias ls='ls --color=auto -Nh'" >> /home/${USERNAME}/.bashrc && \
    poetry completions bash >> /home/${USERNAME}/.bash_completion

#    touch /home/${USERNAME}/.bash_completion && chown ${USERNAME}:${USERNAME} /home/${USERNAME}/.bash_completion

################################################################################
# Debugging with root
################################################################################

RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@${NAME}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> ${HOME}/.bashrc && \
    echo "alias ll='ls --color=auto -alFNh'" >> ${HOME}/.bashrc && \
    echo "alias ls='ls --color=auto -Nh'" >> ${HOME}/.bashrc
