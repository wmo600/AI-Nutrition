import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Works with or without env:
new CdkStack(app, 'CdkStack', {
  env: (env.account && env.region) ? env : undefined,  // optional
});
