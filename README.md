# openapi-base-project

This is a base project for OpenAPI projects. It contains a basic structure for a project, and a few scripts to help you get started.

## Getting started

### Deployment

In /deployment/after-install.sh you need to change the PROJECT_NAME which will be the name of EC2 folder and used for the log group name

In /deployment/appspec.yml you need to change the destination and permission project name with the same PROJECT_NAME

### GitHub actions

In .github/workflows/deploy-to-staging.yml you need to change the env with:

- ECR_REPOSITORY: ECR image name
- DEPLOY_BUCKET: S3 bucket name source for code pipeline (for staging)
- DEPLOY_KEY: S3 bucket path for code pipeline (for staging)
- PIPELINE: Code pipeline name (for staging)

We'll have a different bucket and pipeline for each environment (staging, production, etc)

In .github/workflows/release.yml you need to change the env with:

- ECR_REPOSITORY: ECR image name
- DEPLOY_PROD_BUCKET: S3 bucket name source for code pipeline (for production)
- DEPLOY_PROD_KEY: S3 bucket path for code pipeline (for production)
- ASG_NAME: Auto scaling group name
- PIPELINE: Code pipeline name (for production)

In .github/workflows/push.yml you need to change the env with:

- ECR_REPOSITORY: ECR image name
