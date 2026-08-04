import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import type { IdpEnvironment } from '../config';

beforeAll(() => {
  process.env.PROJECT_ENVIRONMENT = 'qa';
  process.env.PROJECT_PREFIX = 'validation';
  process.env.PROJECT_DOMAIN = 'example.invalid';
  process.env.ROOT_USER_PASSWORD = 'ValidationPassword-NotASecret-123!';
});

test('Cognito custom-resource permissions are scoped to the user pool', () => {
  const { CdkIdpStack } = require('../lib/cdk-idp-stack') as typeof import('../lib/cdk-idp-stack');
  const template = Template.fromStack(new CdkIdpStack(new cdk.App(), 'IdpLeastPrivilegeTest'));
  const policyDocuments = Object.values(template.findResources('AWS::IAM::Policy'))
    .map((resource: any) => JSON.stringify(resource.Properties.PolicyDocument))
    .filter((document) => document.includes('cognito-idp:AdminCreateUser') || document.includes('cognito-idp:AdminSetUserPassword'));

  expect(policyDocuments).toHaveLength(2);
  for (const document of policyDocuments) {
    expect(document).not.toContain('"Resource":"*"');
    expect(document).toContain('Fn::GetAtt');
  }

  template.hasResourceProperties('Custom::AWS', {
    InstallLatestAwsSdk: false,
  });
});

test('deployment configuration rejects incomplete or invalid AWS targets', () => {
  const { validateDeploymentEnvironment } = require('../config') as typeof import('../config');
  const environment: IdpEnvironment = {
    projectName: 'validation',
    projectEnvironment: 'qa',
    projectPrefixPlatform: 'validation',
    aws_account: '000000000000',
    aws_region: 'us-east-2',
    projectSESARN: '',
    projectEMAIL: '',
    projectSUBFIXEMAIL: '',
    projectDomain: 'qa',
    projectEmailDomain: 'qa',
    environmentUrl: 'https://qa.example.invalid/',
    rootUserPassword: 'ValidationPassword-NotASecret-123!',
    googleClientId: '',
  };

  expect(() => validateDeploymentEnvironment(environment)).not.toThrow();
  expect(() => validateDeploymentEnvironment({ ...environment, aws_account: 'not-an-account' })).toThrow(
    'CDK_DEFAULT_ACCOUNT must be a 12-digit AWS account ID.',
  );
});
