#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkIdpStack } from '../lib/cdk-idp-stack';
import environment, { validateDeploymentEnvironment } from '../config';

validateDeploymentEnvironment(environment);
const app = new cdk.App();
new CdkIdpStack(app, `Cdk${environment.projectPrefixPlatform}-idp-${environment.projectEnvironment}Stack`, {
  terminationProtection: true,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  description: `cognito IDP Stack in ${environment.projectEnvironment} environment`,
});
