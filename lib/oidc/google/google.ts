import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface GoogleProviderProps {
    clientId: string;
}

export function createGoogleProvider(scope: Construct, props: GoogleProviderProps): iam.OpenIdConnectProvider {
    return new iam.OpenIdConnectProvider(scope, 'GoogleOIDCProvider', {
        url: 'https://accounts.google.com',
        clientIds: [props.clientId],
    });
}