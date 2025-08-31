# CookShare K8s 로컬 테스트 환경

이 디렉토리는 CookShare 애플리케이션의 로컬 Kubernetes 테스트 환경을 구성하는 매니페스트 파일들을 포함합니다.

## 📋 구성 요소

### Core Components
- `namespace.yaml` - cookshare-local 네임스페이스
- `configmap.yaml` - 환경 변수 설정
- `secret.yaml` - 민감한 정보 (DB 계정, NextAuth 시크릿)
- `storage-class.yaml` - 로컬 스토리지 클래스

### Database
- `postgres-pv.yaml` - PostgreSQL 영구 볼륨
- `postgres-deployment.yaml` - PostgreSQL 배포, 서비스, PVC

### Application
- `app-deployment.yaml` - Next.js 애플리케이션 배포, 서비스, PVC
- `ingress.yaml` - 외부 접근을 위한 Ingress 및 NodePort 서비스

### Deployment
- `deploy.sh` - 전체 환경 배포 스크립트
- `README.md` - 이 파일

## 🚀 빠른 시작

### 1. 사전 요구사항

**Docker Desktop을 사용하는 경우:**
```bash
# Kubernetes 활성화 확인
kubectl cluster-info
```

**Minikube를 사용하는 경우:**
```bash
# Minikube 시작
minikube start

# Ingress 애드온 활성화 (선택적)
minikube addons enable ingress
```

### 2. Docker 이미지 빌드

애플리케이션 배포 전에 Docker 이미지를 빌드해야 합니다:

```bash
# 프로젝트 루트에서
docker build -t cookshare:latest .

# Docker Desktop 사용 시 이미지를 클러스터에서 사용 가능하게 만들기
# (이미 로컬에 있으므로 추가 작업 불필요)

# Minikube 사용 시
minikube image load cookshare:latest
```

### 3. 배포 실행

```bash
# k8s 디렉토리로 이동
cd k8s

# 배포 스크립트 실행
./deploy.sh
```

### 4. 접속

**방법 1: Ingress 사용 (nginx ingress controller 필요)**
```bash
# /etc/hosts 파일에 추가
echo "127.0.0.1 cookshare.local" | sudo tee -a /etc/hosts

# 브라우저에서 접속
open http://cookshare.local
```

**방법 2: NodePort 직접 접근**
```bash
# 브라우저에서 접속
open http://localhost:30000
```

## 🔧 관리 명령어

### 상태 확인
```bash
# 전체 리소스 상태 확인
kubectl get all -n cookshare-local

# Pod 상세 정보
kubectl describe pod -l app=cookshare-app -n cookshare-local

# 로그 확인
kubectl logs -f deployment/cookshare-app -n cookshare-local
kubectl logs -f deployment/postgres -n cookshare-local
```

### 디버깅
```bash
# 애플리케이션 Pod에 접속
kubectl exec -it deployment/cookshare-app -n cookshare-local -- sh

# PostgreSQL 접속
kubectl exec -it deployment/postgres -n cookshare-local -- psql -U cookshare -d cookshare_dev

# Port Forward (로컬에서 직접 접근)
kubectl port-forward service/cookshare-app 3000:3000 -n cookshare-local
kubectl port-forward service/postgres 5432:5432 -n cookshare-local
```

### 환경 초기화
```bash
# 전체 환경 삭제
kubectl delete namespace cookshare-local

# 개별 리소스 삭제
kubectl delete -f .
```

## 📁 볼륨 및 데이터

### 데이터 저장 위치
- **PostgreSQL**: `/tmp/cookshare-postgres-data` (로컬 머신)
- **업로드 파일**: Kubernetes 관리 볼륨

### 데이터 백업/복원
```bash
# PostgreSQL 데이터 백업
kubectl exec deployment/postgres -n cookshare-local -- pg_dump -U cookshare cookshare_dev > backup.sql

# PostgreSQL 데이터 복원
kubectl exec -i deployment/postgres -n cookshare-local -- psql -U cookshare cookshare_dev < backup.sql
```

## 🐛 문제 해결

### 일반적인 문제들

**1. Pod이 ImagePullBackOff 상태인 경우**
```bash
# Docker 이미지가 제대로 빌드되었는지 확인
docker images | grep cookshare

# Minikube 사용 시 이미지 로드 확인
minikube image ls | grep cookshare
```

**2. PostgreSQL 연결 실패**
```bash
# PostgreSQL Pod 상태 확인
kubectl get pod -l app=postgres -n cookshare-local

# PostgreSQL 로그 확인
kubectl logs -l app=postgres -n cookshare-local
```

**3. PersistentVolume 바인딩 실패**
```bash
# PV/PVC 상태 확인
kubectl get pv,pvc -n cookshare-local

# 로컬 디렉토리 권한 확인
sudo mkdir -p /tmp/cookshare-postgres-data
sudo chmod 777 /tmp/cookshare-postgres-data
```

**4. Ingress 접속 불가**
```bash
# Nginx Ingress Controller 설치 (필요한 경우)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Ingress 상태 확인
kubectl get ingress -n cookshare-local
```

## 🔄 개발 워크플로우

### 코드 변경 시
1. Docker 이미지 재빌드: `docker build -t cookshare:latest .`
2. Minikube 사용 시: `minikube image load cookshare:latest`
3. Pod 재시작: `kubectl rollout restart deployment/cookshare-app -n cookshare-local`

### 스키마 변경 시
1. 마이그레이션 파일 생성 (로컬)
2. 이미지 재빌드 및 배포
3. 또는 수동 마이그레이션: `kubectl exec -it deployment/cookshare-app -n cookshare-local -- npx prisma migrate dev`

---

**참고**: 이 설정은 로컬 개발 및 테스트 목적으로만 사용하세요. 프로덕션 환경에는 적합하지 않습니다.