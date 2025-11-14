# AI-Nutrition

🧭 Project Overview

AI-Nutrition is a mobile-first application designed to help users discover nearby grocery and meal options, receive AI-generated meal plans, and track daily macro-nutrients (protein, carbs, fats, calories).

| **Layer**                    | **Technology**                                                        | **Purpose**                                                                                |
| ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Frontend (Mobile)**        | React Native (Expo SDK 54, TypeScript)                                | Cross-platform mobile app (Android + iOS) for browsing, meal planning, and macro tracking. |
| **Backend (Infrastructure)** | AWS CDK v2 (TypeScript)                                               | Infrastructure-as-Code for declarative, version-controlled deployments.                    |
| **Cloud Provider**           | AWS (ap-southeast-1 – Singapore)                                      | Primary environment hosting all backend services.                                          |
| **Authentication**           | Amazon Cognito *(planned)*                                            | Secure user authentication and session management.                                         |
| **Storage**                  | Amazon S3 (✅ deployed test bucket)                                    | File/object storage for datasets, receipts, and uploads.                                   |
| **Database**                 | Amazon RDS for PostgreSQL (+ pgvector planned)                        | Main relational database and vector store for AI queries.                                  |
| **Compute / API**            | AWS Lambda + API Gateway *(planned)*                                  | Serverless backend endpoints for the mobile app.                                           |
| **AI / ML**                  | AWS Bedrock (Claude 3.5 Sonnet + Titan/Cohere Embeddings) *(planned)* | AI-powered meal plan generation, semantic search, and recommendations.                     |
| **Geo-location**             | Amazon Location Service *(planned)*                                   | Retrieve nearby groceries and calculate distances.                                         |
| **Computer Vision**          | Amazon Textract + on-device ML Kit *(planned)*                        | Extract nutrition information from receipts and food labels.                               |
| **IaC Toolchain**            | Node 20 LTS + npm + AWS CDK CLI                                       | Development environment and deployment tooling.                                            |
| **CI/CD & Repo**             | GitHub + GitHub Actions                                               | Version control and continuous integration/deployment.                                     |
