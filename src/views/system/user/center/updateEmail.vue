<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="475px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="New emial" prop="email">
          <el-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendCode">{{ buttonName }}</el-button>
        </el-form-item>
        <el-form-item label="Verification code" prop="code">
          <el-input v-model="form.code" style="width: 320px;" />
        </el-form-item>
        <el-form-item label="Current password" prop="pass">
          <el-input v-model="form.pass" type="password" style="width: 320px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">Cancel</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { validEmail } from '@/utils/validate'
import { updateEmail } from '@/api/system/user'
import { resetEmail } from '@/api/system/code'
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('The new email address cannot be empty.'))
      } else if (value === this.email) {
        callback(new Error('The new email address cannot be the same as the old one.'))
      } else if (validEmail(value)) {
        callback()
      } else {
        callback(new Error('The email format is incorrect.'))
      }
    }
    return {
      loading: false, dialog: false, title: 'Change email address', form: { pass: '', email: '', code: '' },
      user: { email: '', password: '' }, codeLoading: false,
      buttonName: 'Get verification code', isDisabled: false, time: 60,
      rules: {
        pass: [
          { required: true, message: 'The current password cannot be empty.', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'The verification code cannot be empty.', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendCode() {
      if (this.form.email && this.form.email !== this.email) {
        this.codeLoading = true
        this.buttonName = 'Sending...'
        const _this = this
        resetEmail(this.form.email).then(res => {
          this.$message({
            showClose: true,
            message: 'Verification code sent successfully. It is valid for 5 minutes.',
            type: 'success'
          })
          this.codeLoading = false
          this.isDisabled = true
          this.buttonName = 'Resend in ' + this.time-- + ' second'
          this.timer = window.setInterval(function() {
            _this.buttonName = 'Resend in ' + _this.time  + ' second'
            --_this.time
            if (_this.time < 0) {
              _this.buttonName = 'Resending...'
              _this.time = 60
              _this.isDisabled = false
              window.clearInterval(_this.timer)
            }
          }, 1000)
        }).catch(err => {
          this.resetForm()
          this.codeLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateEmail(this.form).then(res => {
            this.loading = false
            this.resetForm()
            this.$notify({
              title: 'Email address updated successfully.',
              type: 'success',
              duration: 1500
            })
            store.dispatch('GetInfo').then(() => {})
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = 'Get verification code'
      this.isDisabled = false
      this.form = { pass: '', email: '', code: '' }
    }
  }
}
</script>

<style scoped>

</style>
