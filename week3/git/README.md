# Git Practice Repository

This is a simple repository for practicing git operations and testing various git workflows. It serves as a sandbox environment for developers to experiment with git commands without affecting production code.

## Contents

- Basic git commands and their usage
- Commit management and best practices
- Branch operations and merging strategies
- Remote repository interactions
- Git configuration examples
- Common troubleshooting scenarios
- **NEW**: Advanced merge conflict resolution techniques
- **NEW**: Git hooks and automation examples

## Features

- **Safe Testing Environment**: Practice git operations without fear of breaking anything
- **Real-world Scenarios**: Examples based on actual development workflows
- **Educational Resources**: Links to helpful git documentation and tutorials
- **Interactive Examples**: Step-by-step guides for common git tasks

## Getting Started

Clone this repository and start experimenting with git commands:

```bash
git clone <repository-url>
cd git-practice
git status
git add .
git commit -m "Your commit message"
```

## 테스트 섹션 (Testing Section)

이 섹션은 git 연습을 위해 추가되었습니다. 다음과 같은 테스트 시나리오를 포함합니다:

- 파일 수정 및 커밋 테스트
- 브랜치 생성 및 병합 테스트
- 충돌 해결 연습

## Common Commands

### Basic Operations
```bash
# Check repository status
git status

# Add files to staging
git add filename.txt
git add .

# Commit changes
git commit -m "Descriptive commit message"

# View commit history
git log --oneline
```

### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature-branch

# List branches
git branch

# Switch branches
git checkout main

# Merge branches
git merge feature-branch
```

## Best Practices

1. **Write descriptive commit messages** - Future you will thank you
2. **Commit frequently** - Small, focused commits are easier to manage
3. **Use branches** - Keep feature development separate from main
4. **Review before pushing** - Always check what you're about to share

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)

## Notes

This repository is part of a larger project structure for learning and experimentation. Feel free to create branches, make commits, and explore different git workflows. The repository is designed to be resilient to experiments and can be reset if needed.