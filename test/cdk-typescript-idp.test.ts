import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

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
});
