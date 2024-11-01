<template>
  <div class="login" :style="'background-image:url(' + Background + ');'">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
      class="login-form">
      <h3 class="title">
        Library Mangement
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="username">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="password"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="verification code" style="width: 63%"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        rememberMe
      </el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">Login</span>
          <span v-else>Logging in...</span>
        </el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button size="medium" type="primary" plain style="width:100%;" @click.native.prevent="handleRegister">
          Register
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
    <el-dialog title="Register" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="registerForm" :model="registerForm" label-width="120px" :rules="registerRules">
        <el-form-item label="UserName" prop="username">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="NickName" prop="nickname">
          <el-input v-model="registerForm.nickname" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="PhoneNumber" prop="phone">
          <el-input v-model="registerForm.phone" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="registerForm.password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
        <el-button size="small" :loading="registering" type="primary" @click="handleRegisterSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/settings'
import { getCodeImg, register } from '@/api/login'
import Cookies from 'js-cookie'
import qs from 'qs'
import Background from '@/assets/images/background.jpg'
export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: 'Username cannot be empty' }],
        password: [{ required: true, trigger: 'blur', message: 'Password cannot be empty' }],
        code: [{ required: true, trigger: 'change', message: 'Verification code cannot be empty' }]
      },
      loading: false,
      redirect: undefined,
      registering: false,
      registerForm: {},
      registerRules: {
        username: [{ required: true, trigger: 'blur', message: 'Username cannot be empty' }],
        nickname: [{ required: true, trigger: 'blur', message: 'Nickname cannot be empty' }],
        email: [{ required: true, trigger: 'change', message: 'Email cannot be empty' }],
        phone: [{ required: true, trigger: 'change', message: 'Phone cannot be empty' }],
        password: [{ required: true, trigger: 'change', message: 'Password cannot be empty' }]
      },
      dialogVisible: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const data = route.query
        if (data && data.redirect) {
          this.redirect = data.redirect
          delete data.redirect
          if (JSON.stringify(data) !== '{}') {
            this.redirect = this.redirect + '&' + qs.stringify(data, { indices: false })
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    this.point()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
            console.log(this.redirect || '/')
          }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.dialogVisible = true
      this.registerForm = {}
      this.registering = false
    },
    handleRegisterSubmit() {
      this.registering = true
      let params = { ...this.registerForm }
      this.$set(params, 'password', encrypt(params.password))
      register(params).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Register Success',
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.$set(this.loginForm, 'username', this.registerForm.username)
        this.$set(this.loginForm, 'password', null)
      }).finally(() => {
        this.registering = false
        this.registerForm = {}
      })
    },
    handleRegisterCancel() {
      this.dialogVisible = false
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$notify({
          title: 'Tips',
          message: 'The current login status has expired. Please log in again！',
          type: 'warning',
          duration: 5000
        })
        Cookies.remove('point')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
