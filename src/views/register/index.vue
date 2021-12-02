<template>
  <div class="register-container">
    <img class="loginBg" :src="loginBgSrc" />
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ RegisterFormTitle }}</h3>
      </div>

      <el-form-item prop="u_name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="registerForm.u_name"
          placeholder="用户名"
          name="u_name"
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
          v-model="registerForm.u_pass"
          :type="passwordType"
          placeholder="密码"
          name="u_pass"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'u_pass' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      
      <el-form-item prop="u_phone">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          v-model="registerForm.u_phone"
          placeholder="手机号"
          name="u_phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="u_real_name">
        <span class="svg-container">
          <svg-icon icon-class="realname" />
        </span>
        <el-input
          v-model="registerForm.u_real_name"
          placeholder="真实姓名"
          name="u_real_name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">点我注册</el-button>

      <div class="tips">
        <span>已有账号？请</span>
        <router-link to="/login">直接登录</router-link>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername,validPhone } from '@/utils/validate'
import { signup } from '@/api/user'
import loginBg from '@/styles/images/loginBg.png'

export default {

  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        "u_phone": "",
        "u_name": "",
        "u_pass": "",
        "u_real_name": "",
        "c_desc":"test",
        "u_avatar": "http://www.avatar.com/header.jpg"
      },
      registerRules: {
        u_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { required: true, min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { required: true, message: '用户名只能带字母、下划线、@、数字，并以字母开头',validator:validateUsername, trigger: 'change'}
        ],
        u_pass: [
          { required: true, message: '请输入密码', trigger: 'blur'},
          { required: true,min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'change' },
        ],
        u_phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true,min: 11, max: 11, message: '请输入正确的手机号',validator:validatePhone, trigger: 'change' }
        ]

      },
      loading: false,
      passwordType: 'u_pass',
      redirect: undefined,
      loginBgSrc:loginBg
    }
  },
  computed: {
    RegisterFormTitle() {
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
      if (this.passwordType === 'u_pass') {
        this.passwordType = ''
      } else {
        this.passwordType = 'u_pass'
      }
      this.$nextTick(() => {
        this.$refs.u_pass.focus()
      })
    },
    handleRegister() {
      const _this = this;
      this.$refs.registerForm.validate(valid => {
        if (valid) {

          signup(_this.registerForm).then(data => {
            this.$message({
              message: '注册成功，三秒后为您跳转到登录页~',
              center: true,
              onClose:()=>{

                this.$router.push({ path: _this.redirect || '/' })
              }
            });
            
          })
        }

      })
    },
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
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

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#152a7d;
$cbdColor:#152a7d;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  height: 100vh;
  width: 100%;
  background:rgba($bg,.8);
  overflow: hidden;
  position: relative;

  .loginBg{
    width: 100%;
  }
  .register-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    max-width: 100%;
    padding: 0 35px;
    margin: 0 auto;
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
      font-size: 26px;
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
