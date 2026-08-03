import { spawnSync } from 'node:child_process';

const acceptedBundledCdkAdvisory = {
  advisoryUrl: 'https://github.com/advisories/GHSA-rgw5-rvv9-x895',
  node: 'node_modules/aws-cdk-lib/node_modules/brace-expansion',
  packageName: 'brace-expansion',
};

const audit = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if (audit.error) {
  throw audit.error;
}

let report;
try {
  report = JSON.parse(audit.stdout);
} catch {
  process.stderr.write(audit.stderr || audit.stdout);
  throw new Error('npm audit did not return valid JSON.');
}

const unacceptable = [];
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  if (!['high', 'critical'].includes(vulnerability.severity)) {
    continue;
  }

  const advisoryUrls = new Set(
    (vulnerability.via ?? [])
      .filter((entry) => typeof entry === 'object')
      .map((entry) => entry.url),
  );
  const accepted =
    vulnerability.name === acceptedBundledCdkAdvisory.packageName &&
    advisoryUrls.size === 1 &&
    advisoryUrls.has(acceptedBundledCdkAdvisory.advisoryUrl) &&
    (vulnerability.nodes ?? []).length === 1 &&
    vulnerability.nodes[0] === acceptedBundledCdkAdvisory.node;

  if (accepted) {
    process.stdout.write(`Temporarily accepted bundled CDK advisory: ${acceptedBundledCdkAdvisory.advisoryUrl}\n`);
  } else {
    unacceptable.push(vulnerability);
  }
}

if (unacceptable.length > 0) {
  process.stderr.write(`${JSON.stringify(unacceptable, null, 2)}\n`);
  process.exitCode = 1;
}
