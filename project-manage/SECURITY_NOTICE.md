# ⚠️ 安全提醒 - 请立即处理

## 🔐 Personal Access Token 安全问题

您的 GitHub Personal Access Token 已在本次操作中暴露在聊天记录中。

**暴露的 Token**: `ghp_eTzOgoYW...` (已脱敏，完整 Token 请查看本地文档)

---

## ✅ 立即执行的操作

### 1. 撤销暴露的 Token

1. 访问 GitHub Token 管理页面:
   ```
   https://github.com/settings/tokens
   ```

2. 在列表中找到对应的 Token

3. 点击 **Delete** 或 **Revoke** 按钮删除该 Token

### 2. 生成新的 Token（如果需要）

1. 在同一页面点击 **Generate new token** → **Generate new token (classic)**

2. 设置 Token 信息:
   - **Note**: 填写用途描述（如：domain-model-design）
   - **Expiration**: 选择过期时间（建议 90 天）
   - **Select scopes**: 勾选 `repo` （完全控制私有仓库）

3. 点击 **Generate token**

4. **重要**: 立即复制 Token 并保存到安全的地方（如密码管理器）
   - Token 只会显示一次！
   - 不要再次将 Token 暴露在聊天或代码中

---

## 🔒 最佳安全实践

### ✅ 应该做的

1. **使用 SSH Key 代替 HTTPS + Token**
   ```bash
   # 生成 SSH Key
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # 添加到 ssh-agent
   ssh-add ~/.ssh/id_ed25519
   
   # 将公钥添加到 GitHub
   cat ~/.ssh/id_ed25519.pub
   # 复制内容到 https://github.com/settings/keys
   
   # 更新远程仓库 URL
   git remote set-url origin git@github.com:zjx-immersion/domain-model-design.git
   ```

2. **使用环境变量存储敏感信息**
   ```bash
   # 不要直接在命令中使用 Token
   export GITHUB_TOKEN="your_token_here"
   git clone https://$GITHUB_TOKEN@github.com/user/repo.git
   ```

3. **使用 Git Credential Manager**
   ```bash
   # macOS
   git config --global credential.helper osxkeychain
   
   # Linux
   git config --global credential.helper store
   
   # Windows
   git config --global credential.helper wincred
   ```

### ❌ 不应该做的

1. ❌ 不要在聊天工具中分享 Token
2. ❌ 不要在代码中硬编码 Token
3. ❌ 不要提交包含 Token 的文件到仓库
4. ❌ 不要给 Token 过高的权限
5. ❌ 不要使用永不过期的 Token

---

## 📋 检查清单

完成后请勾选：

- [ ] 已访问 https://github.com/settings/tokens
- [ ] 已撤销暴露的 Token
- [ ] 已生成新的 Token（如需要）并安全保存
- [ ] 已删除或清理包含 Token 的聊天记录
- [ ] 已考虑使用 SSH Key 代替 HTTPS + Token
- [ ] 已了解 Token 安全最佳实践

---

## 🆘 如果 Token 被滥用

如果发现您的 GitHub 账户有异常活动：

1. **立即撤销所有 Token**
   - https://github.com/settings/tokens

2. **检查仓库活动**
   - 查看最近的提交和 Push 记录
   - 检查仓库的访问日志

3. **修改 GitHub 密码**
   - https://github.com/settings/security

4. **启用两步验证（2FA）**
   - https://github.com/settings/security

5. **联系 GitHub 支持**
   - https://support.github.com

---

## 📚 相关文档

- [GitHub Token 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [SSH Key 配置](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [两步验证设置](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa)

---

**⚠️ 请务必在 24 小时内完成 Token 撤销操作！**

**创建时间**: 2025-01-08  
**状态**: ⚠️ 待处理

