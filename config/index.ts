const getDomain = (env: string) => env !== 'prod' ? `${env}`: `www`;

const getEnvironmentUrl = (environment: string, domain: string) => environment === 'prod' ? `https://www.${domain}/`: `https://${environment}.${domain}/`;

export interface IdpEnvironment {
    projectName: string;
    projectEnvironment: string;
    projectPrefixPlatform: string;
    aws_account: string | undefined;
    aws_region: string;
    projectSESARN: string;
    projectEMAIL: string;
    projectSUBFIXEMAIL: string;
    projectDomain: string;
    projectEmailDomain: string;
    environmentUrl: string;
    rootUserPassword: string;
    googleClientId: string;
}

const envs: IdpEnvironment = {
    projectName: process.env.PROJECT_NAME ?? '',
    projectEnvironment: (process.env.PROJECT_ENVIRONMENT ?? '').toLocaleLowerCase(),
    projectPrefixPlatform: process.env.PROJECT_PREFIX ?? '',
    aws_account: process.env.CDK_DEFAULT_ACCOUNT,
    aws_region: process.env.CDK_DEFAULT_REGION ?? '',
    //projectPoolId: `${process.env.CDK_DEFAULT_REGION}_${cognitoEnvId(process.env.PROJECT_ENVIRONMENT ?? 'qa')}`,
    projectSESARN: process.env.PROJECT_SES_ARN ?? '',
    projectEMAIL: process.env.PROJECT_EMAIL ?? '',
    projectSUBFIXEMAIL: process.env.PROJECT_PREFIX_EMAIL ?? '',
    projectDomain: getDomain(process.env.PROJECT_ENVIRONMENT ?? 'qa'),
    projectEmailDomain: process.env.PROJECT_EMAIL_DOMAIN ?? 'qa',
    environmentUrl: getEnvironmentUrl(process.env.PROJECT_ENVIRONMENT ?? '', process.env.PROJECT_DOMAIN ?? ''),
    rootUserPassword: process.env.ROOT_USER_PASSWORD ?? '',
    googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
};

export function validateDeploymentEnvironment(environment: IdpEnvironment): void {
    const missing = [
        ['PROJECT_ENVIRONMENT', environment.projectEnvironment],
        ['PROJECT_PREFIX', environment.projectPrefixPlatform],
        ['CDK_DEFAULT_ACCOUNT', environment.aws_account],
        ['CDK_DEFAULT_REGION', environment.aws_region],
        ['PROJECT_DOMAIN', process.env.PROJECT_DOMAIN],
        ['ROOT_USER_PASSWORD', environment.rootUserPassword],
    ].filter(([, value]) => !value).map(([name]) => name);

    if (missing.length > 0) {
        throw new Error(`Missing required deployment configuration: ${missing.join(', ')}`);
    }

    if (!/^\d{12}$/.test(environment.aws_account!)) {
        throw new Error('CDK_DEFAULT_ACCOUNT must be a 12-digit AWS account ID.');
    }

    if (environment.rootUserPassword.length < 8) {
        throw new Error('ROOT_USER_PASSWORD must contain at least 8 characters.');
    }
}

export default envs;
