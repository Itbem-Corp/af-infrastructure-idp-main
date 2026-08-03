const getDomain = (env: string) => env !== 'prod' ? `${env}`: `www`;

const getEnvironmentUrl = (environment: string, domain: string) => environment === 'prod' ? `https://www.${domain}/`: `https://${environment}.${domain}/`;

const envs = {
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

export default envs;
