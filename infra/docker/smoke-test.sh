#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/infra/docker/docker-compose.yml"
ENV_FILE="${ROOT_DIR}/.env.docker"
BASE_URL="${BASE_URL:-http://localhost:8080}"

if ! command -v docker >/dev/null 2>&1; then
  echo "缺少 docker 命令，无法执行联调冒烟检查"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "缺少 curl 命令，无法执行联调冒烟检查"
  exit 1
fi

echo "==> 检查容器状态"
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps

echo "==> 检查 API 健康接口"
health_status="$(curl -s -o /tmp/rainy_api_health.json -w "%{http_code}" "${BASE_URL}/api/health")"
if [[ "${health_status}" != "200" ]]; then
  echo "API 健康检查失败，状态码: ${health_status}"
  exit 1
fi

if ! grep -q '"status":"ok"' /tmp/rainy_api_health.json; then
  echo "API 健康检查返回内容异常:"
  cat /tmp/rainy_api_health.json
  exit 1
fi

echo "==> 检查 Nginx 无尾斜杠重定向"
admin_status="$(curl -s -o /dev/null -I -w "%{http_code}" "${BASE_URL}/admin")"
api_status="$(curl -s -o /dev/null -I -w "%{http_code}" "${BASE_URL}/api")"

if [[ "${admin_status}" != "301" ]]; then
  echo "/admin 重定向异常，状态码: ${admin_status}"
  exit 1
fi

if [[ "${api_status}" != "301" ]]; then
  echo "/api 重定向异常，状态码: ${api_status}"
  exit 1
fi

echo "==> 冒烟检查通过"
