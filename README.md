# Grocery Planner App 🛒

A smart grocery planning application built with React Native (Expo) and AWS serverless backend.

## Features

- 🎯 Goal-based grocery planning (Health Maintenance, Budget-Friendly, etc.)
- 📍 Find nearby stores using geocoding
- 📝 Create and manage shopping lists
- 🗓️ Meal planning
- ⭐ AI recommendations (future feature)
- 💰 Weekly deals tracking

## Architecture

### Frontend
- **Framework**: React Native with Expo Router
- **State Management**: Zustand
- **Navigation**: Expo Router (file-based routing)

### Backend (AWS)
- **API Gateway**: HTTP API with CORS support
- **Lambda**: Node.js 20.x function handling API requests
- **Amazon Location Service**: For geocoding and place search
- **Cognito**: User authentication (ready for protected routes)
- **S3**: File uploads storage

## Project Structure

```
.
├── app/                          # Expo app directory (React Native)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── index.tsx            # Home dashboard
│   │   ├── planner.tsx          # Meal planner
│   │   ├── stores.tsx           # Nearby stores
│   │   └── lists.tsx            # Shopping lists
│   ├── login.tsx                # Login screen
│   ├── splash.tsx               # Splash screen
│   └── _layout.tsx              # Root layout
├── src/
│   ├── api.ts                   # API client
│   ├── store.ts                 # Zustand store
│   └── styles/                  # Styling
├── services/
│   └── api/
│       ├── src/
│       │   └── handler.ts       # Lambda function handler
│       ├── package.json
│       └── tsconfig.json
└── infra/
    └── cdk/
        └── lib/
            └── cdk-stack.ts     # AWS CDK infrastructure

```

## API Endpoints

### GET /ping
Health check endpoint
```bash
curl https://YOUR-API-ENDPOINT/ping
```

Response:
```json
{
  "message": "pong",
  "timestamp": "2025-11-17T12:00:00.000Z"
}
```

### GET /geocode?q={query}
Geocode an address or place name using Amazon Location Service

```bash
curl "https://YOUR-API-ENDPOINT/geocode?q=Marina%20Bay%20Sands"
```

Response:
```json
{
  "results": [
    {
      "label": "Marina Bay Sands, 10 Bayfront Avenue, Singapore 018956",
      "address": "Marina Bay Sands, 10 Bayfront Avenue, Singapore 018956",
      "position": [103.8597, 1.2834],
      "country": "SGP",
      "region": "Singapore",
      "municipality": "Singapore",
      "postalCode": "018956"
    }
  ]
}
```

## Prerequisites

### For Frontend Development
- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio

### For Backend Deployment
- AWS Account
- AWS CLI configured with credentials
- AWS CDK CLI: `npm install -g aws-cdk`
- Docker (for CDK bundling)

## Setup Instructions

### 1. Frontend Setup

```bash
# Install dependencies
cd app
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### 2. Backend Deployment

#### First-time setup:

```bash
# Install CDK dependencies
cd infra/cdk
npm install

# Install Lambda dependencies
cd ../../services/api
npm install

# Bootstrap CDK (only needed once per AWS account/region)
cd ../../infra/cdk
cdk bootstrap

# Deploy the stack
cdk deploy
```

After deployment, CDK will output:
- `ApiEndpoint`: Your API Gateway URL
- `UserPoolId`: Cognito User Pool ID
- `UserPoolClientId`: Cognito Client ID
- `PlaceIndexName`: Amazon Location Service place index name

#### Update the frontend with your API endpoint:

```typescript
// src/api.ts
export const API = "https://YOUR-API-ENDPOINT.execute-api.REGION.amazonaws.com";
```

### 3. Testing the API

```bash
# Test ping endpoint
curl https://YOUR-API-ENDPOINT/ping

# Test geocode endpoint
curl "https://YOUR-API-ENDPOINT/geocode?q=Orchard%20Road%20Singapore"
```

## Development Workflow

### Making Changes to the Lambda Function

```bash
# 1. Edit the handler
vim services/api/src/handler.ts

# 2. Deploy changes
cd infra/cdk
cdk deploy
```

### Adding New API Routes

1. Add route in `infra/cdk/lib/cdk-stack.ts`:
```typescript
httpApi.addRoutes({
  path: "/your-new-route",
  methods: [apigwv2.HttpMethod.GET],
  integration: lambdaIntegration,
});
```

2. Handle the route in `services/api/src/handler.ts`:
```typescript
if (path === "/your-new-route" && method === "GET") {
  // Your logic here
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "your response" }),
  };
}
```

3. Deploy:
```bash
cd infra/cdk
cdk deploy
```

### Adding Protected Routes (with Cognito)

1. In `cdk-stack.ts`, add `authorizer` to your route:
```typescript
httpApi.addRoutes({
  path: "/protected",
  methods: [apigwv2.HttpMethod.GET],
  integration: lambdaIntegration,
  authorizer: authorizer,  // Add this line
});
```

2. In your frontend, include the JWT token:
```typescript
const token = await getAuthToken(); // Get from Cognito
const response = await fetch(`${API}/protected`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Environment Variables

### Lambda Environment Variables
Set in `cdk-stack.ts`:
- `PLACE_INDEX_NAME`: Amazon Location Service place index name
- `NODE_OPTIONS`: Node.js options for source maps

### Frontend Environment Variables
Create `.env` file in the app directory:
```
EXPO_PUBLIC_API_URL=https://your-api-endpoint
EXPO_PUBLIC_USER_POOL_ID=your-user-pool-id
EXPO_PUBLIC_USER_POOL_CLIENT_ID=your-client-id
```

## AWS Services Used

### Amazon Location Service
- **Service**: Place index for geocoding
- **Data Provider**: HERE Technologies
- **Pricing**: Pay-per-request
- **Use Case**: Converting addresses/place names to coordinates

### API Gateway HTTP API
- **Type**: HTTP API (cheaper than REST API)
- **CORS**: Enabled for all origins (configure for production)
- **Integration**: Lambda proxy integration

### Lambda
- **Runtime**: Node.js 20.x
- **Bundler**: esbuild (via AWS CDK)
- **Memory**: 256 MB
- **Timeout**: 10 seconds

### Cognito
- **Features**: User authentication, email sign-up
- **Status**: Configured but not yet used in frontend

## Cost Estimation

For a prototype/hackathon with moderate usage:
- API Gateway: ~$1/month (1M requests free tier)
- Lambda: ~$0.20/month (1M requests free tier)
- Amazon Location: ~$5/month (50k searches)
- Cognito: Free tier (50k MAU)
- S3: ~$0.50/month

**Total: ~$7/month** (after free tier expires)

## Troubleshooting

### CDK Deployment Issues

```bash
# Check CDK version
cdk --version

# See what will be deployed
cdk diff

# Force re-deploy
cdk deploy --force
```

### Lambda Errors

```bash
# View Lambda logs
aws logs tail /aws/lambda/YOUR-FUNCTION-NAME --follow

# Or use CDK output
aws logs tail /aws/lambda/CdkStack-ApiHandler --follow
```

### CORS Issues

If you get CORS errors, verify in `cdk-stack.ts`:
```typescript
corsPreflight: {
  allowHeaders: ["authorization", "content-type"],
  allowMethods: [
    apigwv2.CorsHttpMethod.GET,
    apigwv2.CorsHttpMethod.POST,
    apigwv2.CorsHttpMethod.OPTIONS,
  ],
  allowOrigins: ["*"], // Change to specific origins in production
}
```

## Next Steps for Hackathon

1. **Integrate Geocoding in Frontend**
   - Add location search to the stores page
   - Show real-time store locations on map

2. **Add More Endpoints**
   - `/stores/nearby` - Find stores near a location
   - `/deals` - Fetch current deals
   - `/recipes` - Recipe recommendations

3. **AI Integration**
   - Use Claude API for meal planning suggestions
   - Generate shopping lists from recipes

4. **User Authentication**
   - Implement Cognito sign-up/login in frontend
   - Protect user-specific endpoints

5. **Database Integration**
   - Add DynamoDB for user data, lists, and preferences
   - Store user shopping history

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Amazon Location Service](https://docs.aws.amazon.com/location/)
- [API Gateway HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

## License

MIT