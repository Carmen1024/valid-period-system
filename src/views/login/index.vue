<template>
  <div class="login-container">
    <img class="loginBg" :src="loginBgSrc" />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ LoginFormTitle }}</h3>
      </div>

      <el-form-item prop="u_phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="u_phone"
          v-model="loginForm.u_phone"
          placeholder="手机号"
          name="u_phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="u_pass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="u_pass"
          v-model="loginForm.u_pass"
          :type="passwordType"
          placeholder="密码"
          name="u_pass"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">点我登录</el-button>

      <div class="tips">
        <span>没有账号？先</span>
        <router-link to="/register">去注册</router-link>
        <!-- <span style="margin-right:20px;">u_phone: admin</span> -->
        <!-- <span> u_pass: any</span> -->
      </div>

    </el-form>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
import loginBg from '@/styles/images/loginBg.png'

export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('The u_pass can not be less than 3 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // u_phone: '17828019562',
        // u_pass: '123',
        u_phone: '',
        u_pass: ''
      },
      loginRules: {
        u_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true,min: 11, max: 11, message: '请输入正确的手机号',validator:validatePhone, trigger: 'change' }
        ],
        u_pass: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      loginBgSrc:loginBg
    }
  },
  computed: {
    LoginFormTitle() {
      return '茶百道效期系统'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.u_pass.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#152a7d;
$cbdColor:#152a7d;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100vh;
  width: 100%;
  background:rgba($bg,.8);
  overflow: hidden;
  position: relative;

  .loginBg{
    width: 100%;
  }
  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    max-width: 100%;
    padding: 35px;
    // background: $bg;
    // border-radius: 5px;
    // box-shadow: 0 0 5px #ddd;
    overflow: hidden;
    animation: loginMove 1s;

    @keyframes loginMove{
      0%   {top: 0;}
      100% {top: 50%;transform: translate(-50%, -50%);}
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    text-align: right;

    a {
      text-decoration: underline;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 36px;
      color: #fff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
