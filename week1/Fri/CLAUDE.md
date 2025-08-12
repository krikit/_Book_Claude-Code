# Claude Code 프로젝트

## 웹사이트 배포 Best Practices

### 전제 조건
- GitHub 계정이 있다고 가정

### 1. GitHub Pages 배포

#### 정적 사이트 배포
```bash
# 빌드 후 dist/build 폴더를 gh-pages 브랜치에 배포
npm run build
npx gh-pages -d dist

# 또는 GitHub Actions 사용
# .github/workflows/deploy.yml 생성
```

#### GitHub Pages 설정
1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages 또는 main/docs
4. Custom domain 설정 (선택사항)

### 2. Vercel 배포

```bash
# Vercel CLI 설치 및 배포
npm i -g vercel
vercel

# 또는 GitHub 연동으로 자동 배포
```

### 3. Netlify 배포

```bash
# Netlify CLI 사용
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# 또는 GitHub 연동으로 자동 배포
```

### 4. 배포 전 체크리스트

- [ ] 빌드 성공 확인: `npm run build`
- [ ] 환경변수 설정 확인
- [ ] HTTPS 설정
- [ ] Custom domain 설정 (필요시)
- [ ] Analytics 설정 (Google Analytics 등)
- [ ] SEO 최적화 (meta tags, sitemap)
- [ ] 성능 최적화 (이미지 압축, 코드 분할)

### 5. CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml 예시
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 6. 도메인 및 SSL

- Custom domain 설정시 CNAME 파일 추가
- Let's Encrypt 자동 SSL 인증서
- DNS 설정 확인 (A record, CNAME)

### 7. 모니터링 및 분석

- Google Analytics / Google Search Console 설정
- 성능 모니터링 (Lighthouse, WebPageTest)
- 에러 트래킹 (Sentry 등)