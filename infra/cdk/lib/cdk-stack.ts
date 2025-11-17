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
import * as lambda from "aws-cdk-lib/aws-lambda";
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
      removalPolicy: RemovalPolicy.DESTROY,
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
      memorySize: 512, // Increased for AI operations
      timeout: Duration.seconds(30), // Increased for AI/geocoding
      bundling: {
        minify: true,
        target: "node20",
        sourceMap: true,
        forceDockerBundling: false,
      },
      environment: {
        PLACE_INDEX_NAME: placeIndexName,
        NODE_OPTIONS: "--enable-source-maps",
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // Lambda permissions
    apiFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "geo:SearchPlaceIndexForText",
          "geo:SearchPlaceIndexForPosition",
        ],
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
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"], // Change to specific domain in production
      },
    });

    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      "LambdaIntegration",
      apiFn
    );

    // Prepare Cognito authorizer (for future protected routes)
    const authorizer = new authorizers.HttpUserPoolAuthorizer(
      "CognitoAuthorizer",
      userPool,
      {
        userPoolClients: [userPoolClient],
      }
    );

    // ==================== PUBLIC ROUTES ====================

    // Utility
    httpApi.addRoutes({
      path: "/ping",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // Location & Geocoding
    httpApi.addRoutes({
      path: "/geocode",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // Stores
    httpApi.addRoutes({
      path: "/stores",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: "/stores/nearby",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // Deals
    httpApi.addRoutes({
      path: "/deals",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // AI Features (public for now, can add authorizer later)
    httpApi.addRoutes({
      path: "/ai/meal-plan",
      methods: [apigwv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: "/ai/recipe-to-list",
      methods: [apigwv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    // ==================== PROTECTED ROUTES (Optional Cognito Auth) ====================
    // For hackathon, these work without auth
    // To enable auth, add: authorizer: authorizer

    // Shopping Lists
    httpApi.addRoutes({
      path: "/lists",
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: lambdaIntegration,
      // authorizer: authorizer, // Uncomment to require authentication
    });

    httpApi.addRoutes({
      path: "/lists/{id}",
      methods: [
        apigwv2.HttpMethod.GET,
        apigwv2.HttpMethod.PUT,
        apigwv2.HttpMethod.DELETE,
      ],
      integration: lambdaIntegration,
      // authorizer: authorizer, // Uncomment to require authentication
    });

    // User Preferences
    httpApi.addRoutes({
      path: "/preferences",
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.PUT],
      integration: lambdaIntegration,
      // authorizer: authorizer, // Uncomment to require authentication
    });

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