#!/usr/bin/env bash
# Harbor grader for CVE-2020-8203. Exit 0 = pass, 1 = fail.
set -uo pipefail

LODASH_DIR="${1:-/work/lodash}"
GRADER_DIR="$(cd "$(dirname "$0")" && pwd)"
FAIL=0

# 1. Tamper check: agent must not have edited the upstream test suite.
if [ -f "$GRADER_DIR/test_tree.sha256" ]; then
  ( cd "$LODASH_DIR" && sha256sum -c "$GRADER_DIR/test_tree.sha256" --quiet ) \
    || { echo "FAIL: test/ tree modified"; FAIL=1; }
fi

# 2. Exploit PoCs must NOT pollute Object.prototype.
node "$GRADER_DIR/test_exploit.js" "$LODASH_DIR" || FAIL=1

# 3. Benign behavior must be preserved + upstream tests still pass.
node "$GRADER_DIR/test_regression.js" "$LODASH_DIR" || FAIL=1
( cd "$LODASH_DIR" && npm test --silent ) >/tmp/npm.log 2>&1 \
  || { echo "FAIL: npm test"; tail -n 20 /tmp/npm.log; FAIL=1; }

[ $FAIL -eq 0 ] && echo "PASS" || echo "FAIL"
exit $FAIL
