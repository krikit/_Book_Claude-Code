#!/usr/bin/env node
/**
 * Auto-save Claude Code conversations to CLAUDE.log
 * Monitors Claude Code session files and automatically backs up conversations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class ConversationLogger {
  constructor() {
    this.claudeDir = path.join(os.homedir(), '.claude');
    this.projectsDir = path.join(this.claudeDir, 'projects');
    this.logFile = './CLAUDE.log';
    this.lastProcessedSessions = new Set();
    this.projectPath = process.cwd();
    
    // 현재 프로젝트의 인코딩된 경로 찾기
    this.encodedProjectPath = this.encodeProjectPath(this.projectPath);
  }

  encodeProjectPath(projectPath) {
    // Claude Code의 프로젝트 경로 인코딩 방식
    return projectPath.replace(/[\/\\]/g, '-').replace(/^-/, '');
  }

  findProjectSessions() {
    if (!fs.existsSync(this.projectsDir)) {
      console.log('Claude projects directory not found');
      return [];
    }

    const sessions = [];
    const files = fs.readdirSync(this.projectsDir);
    
    for (const file of files) {
      if (file.includes('receipe') || file.includes('week3')) {
        const sessionDir = path.join(this.projectsDir, file);
        if (fs.statSync(sessionDir).isDirectory()) {
          // 디렉토리 내의 .jsonl 파일들 찾기
          const sessionFiles = fs.readdirSync(sessionDir);
          for (const sessionFile of sessionFiles) {
            if (sessionFile.endsWith('.jsonl')) {
              sessions.push(path.join(sessionDir, sessionFile));
            }
          }
        }
      }
    }

    return sessions;
  }

  parseSession(sessionPath) {
    try {
      const content = fs.readFileSync(sessionPath, 'utf8');
      const lines = content.trim().split('\n');
      const messages = [];

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          
          // Claude Code 형식: type이 'user' 또는 'assistant'
          if (data.type === 'user' && data.message?.content) {
            messages.push({
              type: 'user',
              content: typeof data.message.content === 'string' 
                ? data.message.content 
                : JSON.stringify(data.message.content),
              timestamp: data.timestamp
            });
          } else if (data.type === 'assistant' && data.message?.content) {
            // Assistant 메시지 내용 추출
            let content = '';
            if (Array.isArray(data.message.content)) {
              content = data.message.content
                .map(c => c.type === 'text' ? c.text : JSON.stringify(c))
                .join(' ');
            } else if (typeof data.message.content === 'string') {
              content = data.message.content;
            }
            
            if (content.trim()) {
              messages.push({
                type: 'assistant',
                content: content,
                timestamp: data.timestamp
              });
            }
          }
        } catch (e) {
          // 파싱 실패한 줄은 건너뜀
        }
      }

      return messages;
    } catch (error) {
      console.error(`Error parsing session ${sessionPath}:`, error.message);
      return [];
    }
  }

  formatConversation(messages, sessionId) {
    const timestamp = new Date().toISOString();
    const header = `
================================================================================
🤖 Claude Code Conversation Auto-Backup
📅 Saved: ${timestamp}
📁 Session: ${sessionId}
💬 Messages: ${messages.length}
================================================================================

`;

    let conversation = header;
    
    for (const msg of messages) {
      const role = msg.type === 'user' ? '👤 Human' : '🤖 Assistant';
      const time = new Date(msg.timestamp).toLocaleString();
      
      conversation += `${role} [${time}]:\n`;
      conversation += `${msg.content}\n\n`;
      conversation += '─'.repeat(80) + '\n\n';
    }

    return conversation;
  }

  saveToClaudeLog(conversation) {
    try {
      // 기존 CLAUDE.log 읽기
      let existingLog = '';
      if (fs.existsSync(this.logFile)) {
        existingLog = fs.readFileSync(this.logFile, 'utf8');
      }

      // 새 대화를 앞에 추가 (최신이 위로)
      const updatedLog = conversation + '\n' + existingLog;
      
      fs.writeFileSync(this.logFile, updatedLog, 'utf8');
      console.log('✅ Conversation saved to CLAUDE.log');
      return true;
    } catch (error) {
      console.error('❌ Failed to save conversation:', error.message);
      return false;
    }
  }

  async processNewSessions(forceImmediate = false) {
    const sessions = this.findProjectSessions();
    let savedCount = 0;

    for (const sessionPath of sessions) {
      const sessionId = path.basename(sessionPath);
      
      // 이미 처리된 세션인지 확인 (강제 실행 시 제외)
      if (!forceImmediate && this.lastProcessedSessions.has(sessionId)) {
        continue;
      }

      // 파일이 최근에 수정되었는지 확인
      const stats = fs.statSync(sessionPath);
      const now = new Date();
      const modifiedTime = new Date(stats.mtime);
      const timeDiff = (now - modifiedTime) / 1000 / 60; // minutes

      // 5분 이상 전이거나 강제 실행인 경우 처리
      if (timeDiff > 5 || forceImmediate) {
        const messages = this.parseSession(sessionPath);
        
        if (messages.length > 0) {
          const conversation = this.formatConversation(messages, sessionId);
          
          if (this.saveToClaudeLog(conversation)) {
            this.lastProcessedSessions.add(sessionId);
            savedCount++;
            console.log(`📝 Processed session: ${sessionId} (${Math.round(timeDiff)}min ago)`);
          }
        }
      }
    }

    return savedCount;
  }

  // 실시간 모니터링
  startMonitoring() {
    console.log('🔍 Starting Claude Code conversation monitoring...');
    console.log(`📁 Watching: ${this.projectsDir}`);
    console.log(`💾 Saving to: ${this.logFile}`);
    
    // 초기 스캔
    this.processNewSessions();

    // 5분마다 확인
    setInterval(() => {
      this.processNewSessions().then(count => {
        if (count > 0) {
          console.log(`💫 Auto-saved ${count} conversation(s)`);
        }
      });
    }, 5 * 60 * 1000); // 5분

    // 프로세스 종료 시 최종 백업
    process.on('SIGINT', () => {
      console.log('\n🔄 Final backup before exit...');
      this.processNewSessions().then(() => {
        console.log('👋 Goodbye!');
        process.exit(0);
      });
    });
  }

  // 즉시 백업 실행
  async backupNow() {
    console.log('🔄 Starting immediate conversation backup...');
    const count = await this.processNewSessions(true); // 강제 실행
    console.log(`✨ Backed up ${count} conversation(s) to CLAUDE.log`);
  }
}

// CLI 사용
if (require.main === module) {
  const logger = new ConversationLogger();
  
  const command = process.argv[2];
  
  if (command === 'monitor') {
    logger.startMonitoring();
  } else if (command === 'backup') {
    logger.backupNow();
  } else {
    console.log(`
🤖 Claude Code Conversation Logger

Usage:
  node scripts/auto-save-conversation.js backup   # Immediate backup
  node scripts/auto-save-conversation.js monitor  # Start monitoring

Examples:
  npm run save-chat        # Backup now
  npm run monitor-chat     # Start background monitoring
`);
  }
}

module.exports = ConversationLogger;