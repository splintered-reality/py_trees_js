# Preamble from extension [nvidia]
FROM nvidia/opengl:1.2-glvnd-devel-ubuntu20.04 as glvnd

# Preamble from extension [user]


FROM ubuntu:20.04
USER root
# Snippet from extension [nvidia]
RUN DEBIAN__FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends \
    glmark2 \
    libglvnd0 \
    libgl1 \
    libglx0 \
    libegl1 \
    libgles2 \
    libvulkan1 \
    libvulkan-dev \
    vulkan-utils \
    && rm -rf /var/lib/apt/lists/* && \
    VULKAN_API_VERSION=`dpkg -s libvulkan1 | grep -oP 'Version: [0-9|\.]+' | grep -oP '[0-9|\.]+'` && \
    mkdir -p /etc/vulkan/icd.d/ && \
    echo \
   "{\
        \"file_format_version\" : \"1.0.0\",\
        \"ICD\": {\
            \"library_path\": \"libGLX_nvidia.so.0\",\
            \"api_version\" : \"${VULKAN_API_VERSION}\"\
        }\
    }" > /etc/vulkan/icd.d/nvidia_icd.json    

# needed? Seems to work fine without this for glmark2 and vkcube
# COPY --from=glvnd /usr/share/glvnd/egl_vendor.d/10_nvidia.json /usr/share/glvnd/egl_vendor.d/10_nvidia.json

ENV NVIDIA_VISIBLE_DEVICES ${NVIDIA_VISIBLE_DEVICES:-all}
ENV NVIDIA_DRIVER_CAPABILITIES ${NVIDIA_DRIVER_CAPABILITIES:+$NVIDIA_DRIVER_CAPABILITIES,}graphics,display,video,utility,compute

# Snippet from extension [user]
# make sure sudo is installed to be able to give user sudo access in docker
RUN if ! command -v sudo >/dev/null; then \
      apt-get update \
      && apt-get install -y sudo \
      && apt-get clean; \
    fi

################################################################################
# Login Shells for Debugging & Development
################################################################################

# In a login shell (below), the PATH env doesn't survive, configure it at ground zero
# RUN echo "export PATH=${POETRY_HOME}/bin:${PATH}" >> /etc/profile
ENV TERM xterm-256color
ENTRYPOINT ["/bin/bash", "--login", "-i"]

################################################################################
# Development with a user, e.g. for vscode devcontainers
################################################################################

ARG USERNAME=zen
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -s "/bin/bash" -m $USERNAME && \
    apt-get install -y sudo && \
    echo "${USERNAME} ALL=NOPASSWD: ALL" > /etc/sudoers.d/${USERNAME} && \
    chmod 0440 /etc/sudoers.d/${USERNAME}
RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@${NAME}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> /home/${USERNAME}/.bashrc && \
    echo "alias ll='ls --color=auto -alFNh'" >> /home/${USERNAME}/.bashrc && \
    echo "alias ls='ls --color=auto -Nh'" >> /home/${USERNAME}/.bashrc 
    # && \
#    poetry completions bash >> /home/${USERNAME}/.bash_completion

# RUN usermod -a -G video zen <- doesn't do anything

################################################################################
# Debugging with root
################################################################################

RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@${NAME}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> ${HOME}/.bashrc && \
    echo "alias ll='ls --color=auto -alFNh'" >> ${HOME}/.bashrc && \
    echo "alias ls='ls --color=auto -Nh'" >> ${HOME}/.bashrc

# RUN existing_user_by_uid=`getent passwd "1001" | cut -f1 -d: || true` && \
#     if [ -n "${existing_user_by_uid}" ]; then userdel -r "${existing_user_by_uid}"; fi && \
#     existing_user_by_name=`getent passwd "danielstonier" | cut -f1 -d: || true` && \
#     if [ -n "${existing_user_by_name}" ]; then userdel -r "${existing_user_by_name}"; fi && \
#     existing_group_by_gid=`getent group "1001" | cut -f1 -d: || true` && \
#     if [ -z "${existing_group_by_gid}" ]; then \
#       groupadd -g "1001" "danielstonier"; \
#     fi && \
#     useradd --no-log-init --no-create-home --uid "1001" -s "/bin/bash" -c "Daniel Stonier,,," -g "1001" -d "/home/danielstonier" "danielstonier" && \
#     echo "danielstonier ALL=NOPASSWD: ALL" >> /etc/sudoers.d/rocker
# 
# # Making sure a home directory exists if we haven't mounted the user's home directory explicitly
# RUN mkdir -p "$(dirname "/home/danielstonier")" && mkhomedir_helper danielstonier
# # Commands below run as the developer user
# USER danielstonier
# WORKDIR /home/danielstonier
# RUN echo "alias ll='ls --color=auto -alFNh'" >> ~/.bashrc
# RUN echo "alias ls='ls --color=auto -Nh'" >> ~/.bashrc

# RUN echo "export PS1='\[\033[01;36m\](docker)\[\033[00m\] \[\033[01;32m\]\u@foo\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '" >> /home/danielstonier/.bashrc
