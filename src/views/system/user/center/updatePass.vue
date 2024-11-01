<template>
  <div style="display: inline-block">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="500px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-form-item label="Old password" prop="oldPass">
          <el-input v-model="form.oldPass" type="password" auto-complete="on" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="New password" prop="newPass">
          <el-input v-model="form.newPass" type="password" auto-complete="on" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="Confirm password" prop="confirmPass">
          <el-input v-model="form.confirmPass" type="password" auto-complete="on" style="width: 300px;" />
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
import { updatePass } from '@/api/system/user'
export default {
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.form.newPass !== value) {
          callback(new Error('The passwords you entered do not match.'))
        } else {
          callback()
        }
      } else {
        callback(new Error('Please enter your password again.'))
      }
    }
    return {
      loading: false, dialog: false, title: 'Change password', form: { oldPass: '', newPass: '', confirmPass: '' },
      rules: {
        oldPass: [
          { required: true, message: 'Please enter your old password.', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: 'Please enter your new password.', trigger: 'blur' },
          { min: 6, max: 20, message: 'The length should be between 6 and 20 characters.', trigger: 'blur' }
        ],
        confirmPass: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          updatePass(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: 'Password changed successfully. Please log in again.',
              type: 'success',
              duration: 1500
            })
            setTimeout(() => {
              store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 1500)
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
      this.form = { oldPass: '', newPass: '', confirmPass: '' }
    }
  }
}
</script>

<style scoped>

</style>
