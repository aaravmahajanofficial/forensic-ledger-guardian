# Base image: Node.js 24 LTS Devcontainer
FROM mcr.microsoft.com/devcontainers/javascript-node:5-24-bookworm

# Install system dependencies
USER root
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    git \
    vim \
    wget \
    ca-certificates \
    gnupg \
    lsb-release \
    jq \
    bash-completion \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Foundry (Forge, Cast, Anvil, Chisel)
USER node
RUN curl -L https://foundry.paradigm.xyz | bash && \
    /home/node/.foundry/bin/foundryup

# Add Foundry to PATH
ENV PATH="/home/node/.foundry/bin:${PATH}"

# Workdir for VS Code Devcontainers
WORKDIR /workspaces

# Fix git safe.directory warnings
USER root
RUN git config --system --add safe.directory '*'

# Switch back to node user
USER node

# Default shell
CMD ["bash"]
