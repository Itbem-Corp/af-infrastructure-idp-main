import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IdP } from "./idp";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkIdpStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const rootUserPassword = new cdk.CfnParameter(this, 'RootUserPassword', {
      type: 'String',
      noEcho: true,
      minLength: 8,
      description: 'Initial password for the bootstrap Cognito administrator.',
    });

    new IdP(this, 'IDP', { rootUserPassword: rootUserPassword.valueAsString });
  }
}
