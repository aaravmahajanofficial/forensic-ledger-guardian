# Use Node.js 20 LTS as the base image
FROM mcr.microsoft.com/devcontainers/javascript-node:4-20-bookworm

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        build-essential \
        curl \
        git \
        vim \
        wget \
        ca-certificates \
        gnupg \
        lsb-release \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch to node user for installations
USER node

# Install Foundry (Forge, Cast, Anvil, Chisel)
RUN curl -L https://foundry.paradigm.xyz | bash \
    && /home/node/.foundry/bin/foundryup

# Add Foundry to PATH
ENV PATH="/home/node/.foundry/bin:${PATH}"

# Set working directory
WORKDIR /workspace

# Configure git to be safe with the workspace directory
USER root
RUN git config --system --add safe.directory /workspace

USER node

# Verify installations
RUN node --version \
    && npm --version \
    && forge --version \
    && git --version

# Default command
CMD ["bash"]
