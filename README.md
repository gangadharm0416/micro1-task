# Harbor Task: lodash CVE-2020-8203

Patch prototype pollution in lodash's deep-path setter family.
Reference: [lodash/lodash#4759](https://github.com/lodash/lodash/pull/4759).

## Layout

```
task.yaml                 metadata
prompt.md                 ticket the agent sees (as SECURITY.md in /work/lodash)
environment/Dockerfile    node:14 + lodash @ pre-fix SHA, deps installed
grader/run.sh             tamper check + exploit tests + regression + npm test
grader/test_exploit.js    6 PoCs across multiple sinks & path shapes
grader/test_regression.js 5 benign cases (incl. literal "proto" key)
reference/fix.patch       pointer to the upstream patch
```

## Run

```bash
docker build -t harbor-lodash-cve environment/
docker run --rm -v $(pwd)/grader:/work/grader:ro harbor-lodash-cve \
  bash /work/grader/run.sh /work/lodash
```

Before first run, generate the tamper manifest in the built image:

```bash
cd /work/lodash && find test -type f -print0 | sort -z | \
  xargs -0 sha256sum > /work/grader/test_tree.sha256
```

## Pass = `PASS` printed and exit 0. Any stage failing prints `FAIL ...` and exits 1.
