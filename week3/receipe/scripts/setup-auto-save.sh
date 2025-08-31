#!/bin/bash
# Setup automatic conversation saving for Claude Code

set -e

echo "🔧 Setting up Claude Code conversation auto-save..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# 스크립트 실행 권한 설정
chmod +x scripts/auto-save-conversation.js

# Git hook 설정 (선택적)
echo "📝 Setting up Git hooks..."
mkdir -p .git/hooks

# post-commit 후크 (커밋할 때마다 백업)
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Auto-backup Claude conversations after commit
echo "💾 Auto-saving Claude conversation..."
npm run save-chat >/dev/null 2>&1 || true
EOF
chmod +x .git/hooks/post-commit

# pre-push 후크 (푸시하기 전 백업)
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
# Auto-backup Claude conversations before push
echo "💾 Final conversation backup before push..."
npm run save-chat >/dev/null 2>&1 || true
EOF
chmod +x .git/hooks/pre-push

# 초기 백업 실행
echo "🔄 Running initial conversation backup..."
npm run save-chat

echo ""
echo "✅ Auto-save setup complete!"
echo ""
echo "📖 Usage:"
echo "  npm run save-chat      # Manual backup now"
echo "  npm run monitor-chat   # Start background monitoring"
echo ""
echo "🔧 Auto-triggers:"
echo "  ✓ After each git commit"
echo "  ✓ Before each git push"
echo ""
echo "💡 Tips:"
echo "  - Conversations are saved to CLAUDE.log"
echo "  - Latest conversations appear at the top"
echo "  - Run 'npm run save-chat' before important breaks"
echo ""