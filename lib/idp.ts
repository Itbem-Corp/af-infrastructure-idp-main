import * as core from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { default as environment } from "../config";
import { IdPCreateUser } from "./idp-create-user";
import { Duration, Token } from "aws-cdk-lib";
import { getOidcProviderArns } from './oidc/oidc';
import * as path from "path";

export class IdP extends Construct {
  userPoolId: string;
  userPoolClientId: string;
  AWS_REGION: any;
  group_response: any;
  username: any;
  password: any;
  data: any;
  poolid: any;
  constructor(scope: core.Stack, id: string) {
    super(scope, id);
    const userPoolName = `${environment.projectPrefixPlatform}-${environment.projectEnvironment}`;
    this.AWS_REGION = environment.aws_region;

    // const oidcProviderArns = getOidcProviderArns(this);

    /*
     const CustomMessagesFn = new lambda.Function(this, 'CustomMessagesFn', {
         runtime: lambda.Runtime.NODEJS_16_X,
         code: lambda.Code.fromAsset('./lambda/customMessages'),
         handler: 'index.handler',
         environment: {
          environment_variable: environment.projectEnvironment,
          environmentUrl: environment.environmentUrl
        },
     }); */

    const userPool = new cognito.UserPool(this, `${userPoolName}UserPool`, {
      userPoolName,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
        lambdaTriggers: {
          // customMessage: CustomMessagesFn,
        },
        customAttributes: {
          'appuuid': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid2': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid3': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid4': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid5': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid6': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid7': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid8': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid9': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'appuuid10': new cognito.StringAttribute({ minLen: 10, maxLen: 128, mutable: true }),
          'roleId1': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId2': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId3': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId4': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId5': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId6': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId7': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId8': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId9': new cognito.StringAttribute({ minLen: 1, maxLen: 48, mutable: true }),
          'roleId10': new cognito.BooleanAttribute({ mutable: true }),
          'joinedOn': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn2': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn3': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn4': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn5': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn6': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn7': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn8': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn9': new cognito.DateTimeAttribute({ mutable: true }),
          'joinedOn10': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn2': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn3': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn4': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn5': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn6': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn7': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn8': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn9': new cognito.DateTimeAttribute({ mutable: true }),
          'updatedOn10': new cognito.DateTimeAttribute({ mutable: true }),
          'client_uuid': new cognito.StringAttribute({ minLen: 3, maxLen: 96, mutable: true }),
          'created_by': new cognito.StringAttribute({ minLen: 3, maxLen: 48, mutable: true }),
          'hasGeneralAccess': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess2': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess3': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess4': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess5': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess6': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess7': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess8': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess9': new cognito.BooleanAttribute({ mutable: true }),
          'hasAccess10': new cognito.BooleanAttribute({ mutable: true }),
          'google_token_id': new cognito.StringAttribute({ minLen: 1, maxLen: 128, mutable: true }),
        },
    });

    const cfnSystemAdminPoolGroup = new cognito.CfnUserPoolGroup(
      this,
      "MyCfnItbemAdminPoolGroup",
      {
        userPoolId: userPool.userPoolId,
        description: "Itbem Admin Group",
        groupName: "itbem_admin",
        precedence: 0,
      }
    );

      const cfnSuperAdminPoolGroup = new cognito.CfnUserPoolGroup(
        this,
        "MyCfnClientAdminPoolGroup",
        {
          userPoolId: userPool.userPoolId,
          description: "Client Admin Group",
          groupName: "client_admin",
          precedence: 1,
        }
      );

      const cfnAdminPoolGroup = new cognito.CfnUserPoolGroup(
        this,
        "MyCfnUserPoolGroup",
        {
          userPoolId: userPool.userPoolId,
          description: "User Group",
          groupName: "user",
          precedence: 2,
        }
      );
    

     const cfnUserPool = userPool.node.defaultChild as cognito.CfnUserPool;

    const userPoolClient = new cognito.UserPoolClient(this, "userPoolClient", {
      userPool,
      userPoolClientName: userPoolName,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: true,
      accessTokenValidity: Duration.minutes(60) 
    });

    new IdPCreateUser(this, `userAdmin@${environment.projectDomain}`, {
      userPool: userPool,
      username: `admin@${environment.projectDomain}`,
      password: `${environment.rootUserPassword}`,
      groupName: cfnSystemAdminPoolGroup.groupName
    });

  }
}
