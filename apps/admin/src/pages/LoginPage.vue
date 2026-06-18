<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: '123456'
});

async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login(form.username, form.password);
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败');
  } finally {
    loading.value = false;
  }
}

function handleQuickLogin() {
  form.username = 'admin';
  form.password = '123456';
  handleLogin();
}
</script>

<template>
  <div class="login-page">
    <!-- Brand Side -->
    <div class="login-brand">
      <div class="brand-dot" />
      <h1 class="brand-title">Rainy Cole</h1>
      <p class="brand-desc">深度记录，长期存档。<br />内容管理后台</p>
      <div class="brand-tech">
        <span>Monorepo</span>
        <span>NestJS · Vue 3</span>
      </div>
    </div>

    <!-- Form Side -->
    <div class="login-form-wrap">
      <div class="login-card">
        <div class="login-card-head">
          <h2 class="login-card-title">登录后台</h2>
          <p class="login-card-desc">使用管理员或编辑账号登录</p>
        </div>

        <el-form
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="用户名">
            <el-input
              v-model="form.username"
              size="large"
              placeholder="请输入用户名"
            />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              show-password
              placeholder="请输入密码"
            />
          </el-form-item>

          <el-button
            class="login-btn"
            size="large"
            type="primary"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>

        <div class="login-divider">
          <span>快捷登录</span>
        </div>

        <button class="login-quick-btn" @click="handleQuickLogin">
          使用默认账号进入
        </button>

        <p class="login-hint">
          默认账号： admin / 123456 · editor / 123456
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg);
}

/* ===== Brand Side ===== */
.login-brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%);
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  margin-bottom: 20px;
}

.brand-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.brand-desc {
  margin: 16px 0 0;
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 320px;
}

.brand-tech {
  margin-top: 40px;
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.brand-tech span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.brand-tech span + span::before {
  content: '';
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-muted);
  margin-right: 10px;
}

/* ===== Form Side ===== */
.login-form-wrap {
  width: 460px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 380px;
}

.login-card-head {
  margin-bottom: 28px;
}

.login-card-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.login-card-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-btn {
  margin-top: 8px;
  width: 100%;
  height: 44px !important;
  font-size: 15px !important;
}

/* ===== Divider ===== */
.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.login-divider span {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* ===== Quick Login ===== */
.login-quick-btn {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  height: 44px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 140ms ease;
}

.login-quick-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-light);
}

.login-hint {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.6;
}

/* ===== Responsive ===== */
@media (max-width: 860px) {
  .login-page {
    flex-direction: column;
  }

  .login-brand {
    padding: 40px 24px;
    align-items: center;
    text-align: center;
  }

  .brand-desc {
    max-width: 100%;
  }

  .brand-tech {
    justify-content: center;
  }

  .login-form-wrap {
    width: 100%;
    padding: 24px;
  }

  .login-card {
    max-width: 100%;
  }
}
</style>
