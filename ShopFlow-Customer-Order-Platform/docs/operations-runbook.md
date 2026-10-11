# Operations runbook

```bash
kubectl get pods -n shopflow -o wide
kubectl get svc,pvc -n shopflow
kubectl logs -n shopflow deployment/shopflow-api --tail=100
kubectl logs -n shopflow statefulset/postgres --tail=100
```

## API not ready
- Inspect `kubectl describe pod` and API logs.
- Check `/ready`, the `postgres` Service and PostgreSQL pod.
- Verify Secret and ConfigMap keys.
- Do not delete the database PVC as a first troubleshooting step.

## PostgreSQL not starting
- Check PVC binding, mount events, storage and node memory.
- Inspect PostgreSQL logs.
- Preserve the PVC unless intentionally resetting lab data.

## Metrics and logs
- Use `shopflow_http_requests_total` for request volume/status codes.
- Use `shopflow_http_request_duration_seconds_bucket` for latency.
- Correlate `X-Request-Id` from API responses with structured logs in Loki.
