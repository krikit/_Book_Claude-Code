#!/bin/bash

# CookShare Local K8s Deployment Script
# 로컬 테스트용 Kubernetes 배포 스크립트

set -e

echo "🚀 CookShare 로컬 K8s 환경 배포를 시작합니다..."

# 1. Namespace 생성
echo "📦 Namespace 생성..."
kubectl apply -f namespace.yaml

# 2. StorageClass 생성
echo "💾 StorageClass 생성..."
kubectl apply -f storage-class.yaml

# 3. PersistentVolume 생성
echo "🗄️ PersistentVolume 생성..."
kubectl apply -f postgres-pv.yaml

# 4. ConfigMap 및 Secret 생성
echo "🔧 ConfigMap 및 Secret 생성..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 5. PostgreSQL 배포
echo "🐘 PostgreSQL 배포..."
kubectl apply -f postgres-deployment.yaml

# PostgreSQL이 준비될 때까지 대기
echo "⏳ PostgreSQL이 준비될 때까지 대기..."
kubectl wait --for=condition=ready pod -l app=postgres -n cookshare-local --timeout=300s

# 6. 애플리케이션 배포
echo "🌐 CookShare 애플리케이션 배포..."
kubectl apply -f app-deployment.yaml

# 7. Ingress 배포
echo "🌍 Ingress 배포..."
kubectl apply -f ingress.yaml

echo "✅ 배포 완료!"
echo ""
echo "🔗 접속 방법:"
echo "  1. Ingress (nginx ingress controller 필요):"
echo "     - /etc/hosts에 추가: 127.0.0.1 cookshare.local"
echo "     - 브라우저: http://cookshare.local"
echo ""
echo "  2. NodePort (직접 접근):"
echo "     - 브라우저: http://localhost:30000"
echo ""
echo "📊 상태 확인:"
echo "  kubectl get all -n cookshare-local"
echo "  kubectl logs -f deployment/cookshare-app -n cookshare-local"
echo ""
echo "🗑️ 삭제 방법:"
echo "  kubectl delete namespace cookshare-local"