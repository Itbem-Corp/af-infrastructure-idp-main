import { Construct } from 'constructs';
import { createGoogleProvider } from '../providers/google';
import * as iam from 'aws-cdk-lib/aws-iam';
import environment from '../config';

export function getOidcProviderArns(scope: Construct): string[] {
    const arns: string[] = [];

    if (environment.googleClientId) {
        const googleProvider = createGoogleProvider(scope, {
            clientId: environment.googleClientId,
        });
        arns.push(googleProvider.openIdConnectProviderArn);
    }

    // 🔜 for Future Implementations:
    // if (environment.facebookClientId) {
    //   const facebookProvider = createFacebookProvider(scope, {
    //     clientId: environment.facebookClientId,
    //   });
    //   arns.push(facebookProvider.openIdConnectProviderArn);
    // }

    return arns;
}
