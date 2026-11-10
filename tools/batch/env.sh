#!/usr/bin/env bash
# Source before running batches on Linux/macOS (cloud sessions): `source tools/batch/env.sh`
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 TURBO_TELEMETRY_DISABLED=1
export GIT_AUTHOR_NAME=Claude GIT_AUTHOR_EMAIL=noreply@anthropic.com GIT_COMMITTER_NAME=Claude GIT_COMMITTER_EMAIL=noreply@anthropic.com
export COMMIT_TRAILER="Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
command -v pnpm >/dev/null 2>&1 || corepack enable pnpm 2>/dev/null || npm i -g pnpm@10.28.0
