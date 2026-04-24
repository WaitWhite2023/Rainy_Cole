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
const rememberMe = ref(true);

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
</script>

<template>
  <div class="admin-login">
    <header class="admin-login-topbar">
      <div class="admin-brand">Rainy</div>
      <RouterLink to="/" class="admin-login-return">← 返回首页</RouterLink>
    </header>

    <div class="admin-login-wrap">
      <section class="admin-login-copy">
        <div class="admin-login-copy-inner">
          <p class="admin-kicker">Welcome back</p>
          <h1 class="admin-login-title">
            LOGIN TO
            <span class="block">RAINY</span>
            <span class="block">COLE</span>
          </h1>
          <p class="admin-login-text">
            深度记录，长期存档。<br />
            继续管理你的文章与草稿。
          </p>
          <p class="admin-login-note">
            DEEP ESSAYS, LONG-TERM ARCHIVE.<br />
            默认账号：`admin / 123456`、`editor / 123456`
          </p>
        </div>
      </section>

      <section class="admin-login-panel">
        <div class="admin-login-card">
          <div class="admin-login-card-head">
            <div>
              <h2 class="admin-login-card-title">账号登录。</h2>
              <p class="admin-login-card-copy">登录后可管理文章、草稿与个人内容。</p>
            </div>
          </div>

          <el-form label-position="top" class="admin-login-form" @submit.prevent="handleLogin">
            <el-form-item label="用户名 / 邮箱">
              <el-input v-model="form.username" size="large" placeholder="请输入用户名或邮箱" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" size="large" type="password" show-password placeholder="请输入密码" />
            </el-form-item>

            <div class="admin-login-actions">
              <label class="admin-login-check">
                <input v-model="rememberMe" type="checkbox" />
                <span>记住我</span>
              </label>
              <button type="button" class="admin-login-link">忘记密码？</button>
            </div>

            <el-button class="w-full" size="large" type="primary" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form>

          <div class="admin-login-divider">
            <span>管理后台</span>
          </div>

          <button type="button" class="admin-login-secondary" @click="handleLogin">
            使用默认账号进入
          </button>

          <div class="admin-login-foot">
            <span>Monorepo</span>
            <span>NestJS · Vue 3</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
