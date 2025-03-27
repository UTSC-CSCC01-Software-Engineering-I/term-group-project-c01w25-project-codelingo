# CI/CD Pipeline - Codeify

This repository contains the CI/CD pipeline setup for the Codeify microservices project using GitHub Actions, Docker, and AWS.

## 📦 Project Structure

```bash
.github/
└── workflows/
    └── main.yml
frontend/
admin/
backend/
├── user-service/
├── auth-service/
├── problem-service/
├── lesson-service/
└── match-making-service/
```

## 🚀 Technologies Used
- **GitHub Actions** – For continuous integration and deployment
- **Docker** – For containerization
- **AWS ECR & Lambda** – For backend image hosting and serverless deployment
- **AWS EC2** – For frontend hosting

## 🧪 CI Pipeline
The CI pipeline runs automatically on every push to the `main` or `fix/user-service-tests` branches.

### Steps:
1. Checkout code
2. Setup Node.js environment (v20)
3. Install dependencies and run Jest tests for each microservice and the frontend

## 🔄 CD Pipeline
After passing tests, Docker images are built and pushed to Docker Hub and AWS ECR. Services are then deployed as follows:

### Backend Services
- Built and tagged as `:latest`
- Pushed to Docker Hub and AWS ECR
- Deployed to **AWS Lambda** using updated image URIs

### Frontend
- Built and pushed to Docker Hub
- Deployed to **EC2** via SSH and Docker

## 🐳 Docker
Each service includes a `Dockerfile` similar to:
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE xxxx
CMD ["npm", "run"]
```

## 🔐 Secrets
GitHub Actions use the following secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `EC2_HOST`
- `EC2_SSH_KEY`

## 🧰 How to Run Locally
```bash
cd backend/user-service
npm install
npm test
# or to build and run
docker build -t user-service .
docker run -p xxxx:xxxx user-service
```

## 📝 Authors
- [Your Name(s)]

## 📄 License
[Specify License Here]
