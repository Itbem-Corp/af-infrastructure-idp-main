# EventiApp identity infrastructure

This CDK project owns the Cognito user pool, its client, the standard role groups,
and the bootstrap administrator for one environment. It is deployed independently
from application code so authentication changes remain explicit and reviewable.

## Required deployment configuration

The CDK entrypoint fails before synthesis or deployment when any required setting is
missing. This prevents creating resources with empty names or a blank bootstrap
password.

| Variable | Purpose |
| --- | --- |
| `PROJECT_ENVIRONMENT` | Environment identifier, for example `qa` or `prod`. |
| `PROJECT_PREFIX` | Stable product prefix used in resource names. |
| `PROJECT_DOMAIN` | Base domain used for callback URLs. |
| `PROJECT_EMAIL_DOMAIN` | Administrator email domain; defaults to `PROJECT_DOMAIN`. |
| `ROOT_USER_PASSWORD` | Initial administrator password (minimum eight characters). |
| `CDK_DEFAULT_ACCOUNT` | Target 12-digit AWS account ID. |
| `CDK_DEFAULT_REGION` | Target AWS region. |

`GOOGLE_OAUTH_CLIENT_ID` is optional and reserved for the OIDC provider integration.
Never commit real credentials or passwords; configure them through the deployment
environment or GitHub/AWS secrets.

## Local workflow

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run audit:production
npx cdk synth
npx cdk diff
```

The custom resources intentionally use the AWS SDK bundled with their runtime.
This keeps deployments deterministic and avoids the minute-long mutable SDK install
that CDK enables by default. Update CDK deliberately when a newer API is required.

The legacy `Makefile` keeps its positional deployment interface and now passes the
domain, account and region consistently to CDK. Prefer explicit environment variables
in CI; they are easier to audit and avoid positional-argument mistakes.
