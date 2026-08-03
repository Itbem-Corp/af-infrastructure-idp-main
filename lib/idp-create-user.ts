import {
  CfnUserPoolUserToGroupAttachment,
  UserPool,
} from "aws-cdk-lib/aws-cognito";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { default as environment } from "../config";

export class IdPCreateUser extends Construct {
  username: string;
  constructor(
    scope: Construct,
    id: string,
    props: {
      userPool: UserPool;
      username: string;
      password: string;
      groupName: any;
    }
  ) {
    super(scope, id);

    this.username = props.username;

    // Create the user inside the Cognito user pool using Lambda backed AWS Custom resource
    const adminCreateUser = new AwsCustomResource(
      this,
      `${environment.projectPrefixPlatform}-${environment.projectEnvironment}-AwsCustomResource-CreateUser`,
      {
        onCreate: {
          service: "CognitoIdentityServiceProvider",
          action: "adminCreateUser",
          parameters: {
            UserPoolId: `${props.userPool.userPoolId}`,
            Username: `${props.username}`,
            MessageAction: "SUPPRESS",
            TemporaryPassword: `${props.password}`,
          },
          physicalResourceId: PhysicalResourceId.of(
            `${environment.projectPrefixPlatform}-${environment.projectEnvironment}-AwsCustomResource-CreateUser-${props.username}`
          ),
        },
        onDelete: {
          service: "CognitoIdentityServiceProvider",
          action: "adminDeleteUser",
          parameters: {
            UserPoolId: `${props.userPool.userPoolId}`,
            Username: `${props.username}`,
          },
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: [props.userPool.userPoolArn],
        }),
        installLatestAwsSdk: true,
      }
    );

    // Force the password for the user, because by default when new users are created
    // they are in FORCE_PASSWORD_CHANGE status. The newly created user has no way to change it though
    const adminSetUserPassword = new AwsCustomResource(
      this,
      `${environment.projectPrefixPlatform}-${environment.projectEnvironment}-AwsCustomResource-ForcePassword`,
      {
        onCreate: {
          service: "CognitoIdentityServiceProvider",
          action: "adminSetUserPassword",
          parameters: {
            UserPoolId: `${props.userPool.userPoolId}`,
            Username: `${props.username}`,
            Password: `${props.password}`,
            Permanent: true,
          },
          physicalResourceId: PhysicalResourceId.of(
            `${environment.projectPrefixPlatform}-${environment.projectEnvironment}-AwsCustomResource-ForcePassword-${props.username}`
          ),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: [props.userPool.userPoolArn],
        }),
        installLatestAwsSdk: true,
      }
    );
    adminSetUserPassword.node.addDependency(adminCreateUser);

    // If a Group Name is provided, also add the user to this Cognito UserPool Group
  
      const userToAdminsGroupAttachment = new CfnUserPoolUserToGroupAttachment(
        this,
        `${environment.projectPrefixPlatform}-${environment.projectEnvironment}-AttachAdminToAdminsGroup`,
        {
          userPoolId: `${props.userPool.userPoolId}`,
          groupName: `${props.groupName}`,
          username: `${props.username}`,
        }
      );
      userToAdminsGroupAttachment.node.addDependency(adminCreateUser);
      userToAdminsGroupAttachment.node.addDependency(adminSetUserPassword);
      userToAdminsGroupAttachment.node.addDependency(props.userPool);
   
  }
}
