# ShopFlow architecture

```mermaid
flowchart TD
  C[Client] --> API[ShopFlow REST API]
  API --> DB[(PostgreSQL)]
  G[GitHub source] --> J[Jenkins CI]
  J --> S[SonarQube]
  J --> REG[Container Registry]
  G --> A[Argo CD]
  REG --> K[Minikube / Kubernetes]
  A --> K
  K --> API
  K --> DB
  P[Prometheus] -->|scrapes /metrics| API
  AL[Grafana Alloy] -->|logs| L[Loki]
  P --> GR[Grafana]
  L --> GR
```

CI builds and tests application code, runs analysis, builds/scans an image and publishes an immutable tag. The desired image tag is committed to GitOps manifests; Argo CD reconciles those manifests into Kubernetes. Prometheus, Alloy and Loki provide metrics and logs for troubleshooting.
