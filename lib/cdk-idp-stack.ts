import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IdP } from "./idp";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkIdpStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new IdP(this, "IDP");
  }
}
