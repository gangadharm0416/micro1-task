FROM node:14-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /work
# Pre-fix SHA (commit just before PR #4759 was merged)
ARG VULN_SHA=2da024c3b4f9947a48517639de7560457cd4ec6c
RUN git clone https://github.com/lodash/lodash.git \
 && cd lodash && git checkout ${VULN_SHA} && rm -rf .git \
 && npm install --no-audit --no-fund --legacy-peer-deps

COPY prompt.md /work/lodash/SECURITY.md
COPY grader    /work/grader

WORKDIR /work/lodash
