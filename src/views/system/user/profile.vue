<template>
  <div class="app-container">
    <el-button class="float-button" size="small" @click="handleReturn" type="primary"><i class="el-icon-back" />
      Back</el-button>
    <div class="content-wrapper">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Personal information</span>
            </div>
            <div>
              <div style="text-align: center">
                <div class="el-upload">
                  <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar"
                    title="Click to upload avatar" class="avatar" @click="toggleShow">
                  <myUpload v-model="show" :headers="headers" :url="updateAvatarApi"
                    @crop-upload-success="cropUploadSuccess" />
                </div>
              </div>
              <ul class="user-info">
                <li>
                  <div style="height: 100%"><svg-icon icon-class="login" /> UserName<div class="user-right">{{
                    user.username }}</div>
                  </div>
                </li>
                <li><svg-icon icon-class="user1" /> NickName <div class="user-right">{{ user.nickName }}</div>
                </li>
                <li><svg-icon icon-class="phone" /> PhoneNumber <div class="user-right">{{ user.phone }}</div>
                </li>
                <li><svg-icon icon-class="email" /> Email <div class="user-right">{{ user.email }}</div>
                </li>
                <li>
                  <svg-icon icon-class="anq" /> Security settings
                  <div class="user-right">
                    <a @click="$refs.pass.dialog = true">Change password</a>
                    <!--
                  <a @click="$refs.email.dialog = true">修改邮箱</a>  -->
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
          <!--    用户资料    -->
          <el-card class="box-card">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="User profile" name="first">
                <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small"
                  label-width="120px">
                  <el-form-item label="NickName" prop="nickName">
                    <el-input v-model="form.nickName" style="width: 35%" />
                    <span style="color: #C0C0C0;margin-left: 10px;">User nickname is not used for login.</span>
                  </el-form-item>
                  <el-form-item label="PhoneNumber" prop="phone">
                    <el-input v-model="form.phone" style="width: 35%;" />
                    <span style="color: #C0C0C0;margin-left: 10px;">Phone number cannot be duplicated.</span>
                  </el-form-item>
                  <el-form-item label="Gender">
                    <el-radio-group v-model="form.gender" style="width: 178px">
                      <el-radio label="男">Male</el-radio>
                      <el-radio label="女">Female</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">Save
                      configuration</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
      <updateEmail ref="email" :email="user.email" />
      <updatePass ref="pass" />
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import crud from '@/mixins/crud'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
export default {
  name: 'Center',
  components: { updatePass, updateEmail, myUpload },
  mixins: [crud],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter your phone number'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('Please enter the correct 11-digit mobile phone number'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: 'Please enter user nickname', trigger: 'blur' },
          { min: 2, max: 20, message: 'The length should be between 2 and 20 characters.', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  created() {
    this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    store.dispatch('GetInfo').then(() => { })
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = 'api/logs/user'
      return true
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch('GetInfo').then(() => { })
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.editSuccessNotify()
              store.dispatch('GetInfo').then(() => { })
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    },
    handleReturn() {
      this.$router.go(-1)
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container,
body,
html {
  background: var(--WR_BC23, #f4f5f7);
}

.app-container {
  box-sizing: border-box;
  width: 100%;
  padding: 40px 80px;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  flex-direction: column;

  .float-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    }

  .content-wrapper {
    box-sizing: border-box;
    width: 80%;
  }
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

    a {
      color: #317EF3;
    }
  }
}
</style>
