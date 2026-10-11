# ShopFlow — Customer Order Management Platform

A realistic training project for application engineering, CI/CD, Kubernetes GitOps and observability.

## Included

- Node.js 22 / Express REST API with product and order resources
- PostgreSQL schema, indexes, seeded products, order items and transactional inventory decrement
- Request validation with Zod and parameterized SQL
- Structured JSON logs with Pino, request IDs, basic redaction
- Helmet security headers, configurable CORS and rate limiting
- `/health`, `/ready` and Prometheus `/metrics` endpoints
- Graceful shutdown and PostgreSQL connection pooling
- Dockerfile running as non-root and Docker Compose for local testing
- Jest/Supertest test starter, ESLint configuration and SonarQube properties
- Jenkins pipeline starter
- Kubernetes Kustomize manifests with two API replicas and PostgreSQL StatefulSet/PVC

This is a training project, not an audited production system. The sample Kubernetes Secret is intentionally a placeholder. Do not commit actual passwords, tokens or `.env` files.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API metadata |
| GET | `/health` | Process health |
| GET | `/ready` | PostgreSQL readiness |
| GET | `/metrics` | Prometheus metrics |
| GET | `/api/v1` | Resource index |
| GET | `/api/v1/products` | List products (`limit`, `offset`) |
| POST | `/api/v1/products` | Create a product |
| GET | `/api/v1/products/:id` | Product details |
| GET | `/api/v1/orders` | List orders (`status`, `limit`, `offset`) |
| POST | `/api/v1/orders` | Create an order |
| GET | `/api/v1/orders/:id` | Order details and line items |
| PATCH | `/api/v1/orders/:id/status` | Change order status |

Prices are stored as integer cents. Order creation locks product rows, validates available stock and performs order creation, item inserts and inventory updates in a single database transaction. `Idempotency-Key` is accepted for order requests to help prevent accidental duplicate submissions.

## Run locally

Requirements: Docker Desktop or Docker Engine with Compose.

```bash
docker compose up --build
```

In another terminal:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/ready
curl http://localhost:3000/api/v1/products
curl http://localhost:3000/metrics
```

Create a sample order (product ID 1 is seeded):

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-order-0001' \
  -d '{"customerName":"Sam Example","customerEmail":"sam@example.com","items":[{"productId":1,"quantity":2}]}'
```

Run lint/tests locally with Node.js 20+:

```bash
npm install
npm run lint
npm test
```

## Publish to GitHub

Extract this ZIP, create an empty GitHub repository (for example `shopflow-customer-order-platform`), then run in the extracted project folder:

```bash
git init
git add .
git commit -m "Initial ShopFlow platform"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/shopflow-customer-order-platform.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username. Keep real credentials out of Git.

## Kubernetes / Argo CD preparation

The `k8s/base` folder is a starter Kustomize package. Before deploying:
1. Replace `REPLACE_WITH_GITHUB_OWNER` in `k8s/base/api.yaml` with the actual container registry owner/path.
2. Build and publish the API image before syncing these manifests.
3. Replace the lab-only database password; ideally use a secret manager or encrypted-secret workflow rather than storing secrets in Git.
4. Validate manifests with `kubectl kustomize k8s/base`.
5. Preserve the PostgreSQL PVC during troubleshooting unless you deliberately intend to destroy the database data.

## CI/CD and observability roadmap

The Jenkinsfile is a starter and deliberately leaves SonarQube, image scanning and registry publishing as explicit configuration steps rather than pretending credentials are already configured. We will connect it to your Jenkins, SonarQube, Nexus and Argo CD lab after the source is in GitHub.

The API exposes `/metrics` and writes JSON logs to stdout. Later:
- Prometheus will scrape request and process metrics.
- Grafana Alloy will collect Kubernetes/container logs and send them to Loki.
- Grafana will correlate request rates, errors, latency and logs.
