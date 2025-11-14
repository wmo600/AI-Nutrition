// infra/cdk/lib/cdk-stack.ts
import {
  Stack,
  StackProps,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";

import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";

import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda"; // runtime enum
import * as location from "aws-cdk-lib/aws-location";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ---- S3 (dev bucket) ----
    const uploads = new s3.Bucket(this, "Uploads", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ---- Cognito ----
    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      passwordPolicy: { minLength: 8 },
      removalPolicy: RemovalPolicy.DESTROY, // change to RETAIN for prod
    });
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
    });

    // ---- Amazon Location Place Index ----
    const placeIndexName = `${this.stackName.toLowerCase()}-places`;
    const placeIndex = new location.CfnPlaceIndex(this, "PlaceIndex", {
      indexName: placeIndexName,
      dataSource: "Here",
      pricingPlan: "RequestBasedUsage",
    });

    // ---- Lambda (bundled with esbuild) ----
    const apiFn = new lambdaNode.NodejsFunction(this, "ApiHandler", {
      entry: path.resolve(__dirname, "../../../services/api/src/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(10),
      bundling: {
        minify: true,
        target: "node20",
        sourceMap: true,
        forceDockerBundling: false,
        // externalModules: [],   // let esbuild bundle deps from services/api
      },
      environment: {
        PLACE_INDEX_NAME: placeIndexName,
        NODE_OPTIONS: "--enable-source-maps",
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // Lambda can call the place index
    apiFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["geo:SearchPlaceIndexForText"],
        resources: [placeIndex.attrIndexArn],
      })
    );

    // ---- HTTP API (CORS open for dev) ----
    const httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowHeaders: ["authorization", "content-type"],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"],
      },
    });

    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      "LambdaIntegration",
      apiFn
    );

    // Public routes
    httpApi.addRoutes({
      path: "/ping",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });
    httpApi.addRoutes({
      path: "/geocode",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // Prepare Cognito authorizer (for future protected routes)
    const authorizer = new authorizers.HttpUserPoolAuthorizer(
      "CognitoAuthorizer",
      userPool,
      {
        userPoolClients: [userPoolClient],
      }
    );
    // Use `authorizer` when you add protected routes.

    // ---- Outputs ----
    new CfnOutput(this, "ApiEndpoint", { value: httpApi.apiEndpoint });
    new CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, "PlaceIndexName", { value: placeIndexName });
    new CfnOutput(this, "UploadsBucket", { value: uploads.bucketName });
  }
}
