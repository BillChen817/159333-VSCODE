<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <crudOperation show="" />
        </div>
        <div style="margin: 15px;">
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
                <el-table-column :selectable="checkboxT" type="selection" width="55" />
                <el-table-column :show-overflow-tooltip="true" prop="username" label="username" />
                <el-table-column :show-overflow-tooltip="true" prop="nickName" label="nickname" />
                <el-table-column prop="gender" label="gender" />
                <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="concat" />
                <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="email" />
                <el-table-column label="status" align="center" prop="enabled">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" :disabled="user.id === scope.row.id || user.id == '1'"
                            active-color="#409EFF" inactive-color="#F56C6C"
                            @change="changeEnabled(scope.row, scope.row.enabled)" />
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="createTime" />
                <el-table-column v-if="checkPer(['admin', 'user:edit', 'user:del'])" label="operation" width="115"
                    align="center" fixed="right">
                    <template slot-scope="scope">
                        <udOperation :data="scope.row" :permission="permission"
                            :disabled-dle="scope.row.id === user.id" />
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
            <!--表单渲染-->
            <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
                :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
                <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="140px">
                    <el-form-item label="username" prop="username">
                        <el-input v-model="form.username" />
                    </el-form-item>
                    <el-form-item label="phone" prop="phone">
                        <el-input v-model.number="form.phone" />
                    </el-form-item>
                    <el-form-item label="nickname" prop="nickName">
                        <el-input v-model="form.nickName" />
                    </el-form-item>
                    <el-form-item label="email" prop="email">
                        <el-input v-model="form.email" />
                    </el-form-item>
                    <el-form-item label="role">
                        <el-select v-model="roleDatas" multiple placeholder="select"
                            @remove-tag="deleteTag" @change="changeRole">
                            <el-option v-for="item in roles" :key="item.name"
                                :disabled="level !== 1 && item.level <= level" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="gender">
                        <el-radio-group v-model="form.gender" style="width: 178px">
                            <el-radio label="male">male</el-radio>
                            <el-radio label="female">femal</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="status">
                        <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
                            <el-radio v-for="item in dict.user_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="crud.cancelCU">cancel</el-button>
                    <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">submit</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

let userRoles = []
let userJobs = []
const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }

export default {
    name: 'bookUsers',
    components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
    cruds() {
        return CRUD({ title: 'Users', url: 'api/users', crudMethod: { ...crudUser } })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 数据字典
    dicts: ['user_status'],
    data() {
        // 自定义验证
        const validPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('Please input correct phone number'))
            } else if (!isvalidPhone(value)) {
                callback(new Error('The length of phone should be 11.'))
            } else {
                callback()
            }
        }
        return {
            height: document.documentElement.clientHeight - 180 + 'px;',
            deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
            jobDatas: [], roleDatas: [], // 多选时使用
            defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
            permission: {
                add: ['admin', 'user:add'],
                edit: ['admin', 'user:edit'],
                del: ['admin', 'user:del']
            },
            enabledTypeOptions: [
                { key: 'true', display_name: 'valid' },
                { key: 'false', display_name: 'lock' }
            ],
            rules: {
                username: [
                    { required: true, message: 'please input username', trigger: 'blur' },
                    { min: 2, max: 20, message: 'username must between 2 chars to 20 chars', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: 'please input nickname', trigger: 'blur' },
                    { min: 2, max: 20, message: 'nickname must between 2 chars to 20 chars', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'please input email', trigger: 'blur' },
                    { type: 'email', message: 'make sure input valid email', trigger: 'blur' }
                ],
                phone: [
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
            },
            listLoading: false,
            listData: [],
        }
    },
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    created() {
        this.crud.msg.add = 'Add user uccess， default password is 123456'
    },
    mounted: function () {
        const that = this
        window.onresize = function temp() {
            that.height = document.documentElement.clientHeight - 180 + 'px;'
        }
    },
    methods: {
        changeRole(value) {
            userRoles = []
            value.forEach(function (data, index) {
                const role = { id: data }
                userRoles.push(role)
            })
        },
        changeJob(value) {
            userJobs = []
            value.forEach(function (data, index) {
                const job = { id: data }
                userJobs.push(job)
            })
        },
        deleteTag(value) {
            userRoles.forEach(function (data, index) {
                if (data.id === value) {
                    userRoles.splice(index, value)
                }
            })
        },
        // 新增与编辑前做的操作
        [CRUD.HOOK.afterToCU](crud, form) {
            this.getRoles()
            // if (form.id == null) {
            //     this.getDepts()
            // } else {
            //     this.getSupDepts(form.dept.id)
            // }
            this.getRoleLevel()
            this.getJobs()
            form.enabled = form.enabled.toString()
        },
        // 新增前将多选的值设置为空
        [CRUD.HOOK.beforeToAdd]() {
            this.jobDatas = []
            this.roleDatas = []
            this.favoriteGenres = []
        },
        // 初始化编辑时候的角色与岗位
        [CRUD.HOOK.beforeToEdit](crud, form) {
            this.getJobs(this.form.dept.id)
            this.jobDatas = []
            this.roleDatas = []
            userRoles = []
            userJobs = []
            const _this = this
            form.roles.forEach(function (role, index) {
                _this.roleDatas.push(role.id)
                const rol = { id: role.id }
                userRoles.push(rol)
            })
            form.jobs.forEach(function (job, index) {
                _this.jobDatas.push(job.id)
                const data = { id: job.id }
                userJobs.push(data)
            })
        },
        // 提交前做的操作
        [CRUD.HOOK.afterValidateCU](crud) {
            if (this.roleDatas.length === 0) {
                this.$message({
                    message: 'role must input',
                    type: 'warning'
                })
                return false
            }
            if (this.favoriteGenres.length === 0) {
                this.$message({
                    message: 'favorite genres must input',
                    type: 'warning'
                })
                return false
            }
            crud.form.favoriteGenres = this.favoriteGenres.join()
            crud.form.roles = userRoles
            crud.form.jobs = userJobs
            return true
        },
        // 获取左侧部门数据
        getDeptDatas(node, resolve) {
            const sort = 'id,desc'
            const params = { sort: sort }
            if (typeof node !== 'object') {
                if (node) {
                    params['name'] = node
                }
            } else if (node.level !== 0) {
                params['pid'] = node.data.id
            }
            setTimeout(() => {
                getDepts(params).then(res => {
                    if (resolve) {
                        resolve(res.content)
                    } else {
                        this.deptDatas = res.content
                    }
                })
            }, 100)
        },
        getDepts() {
            getDepts({ enabled: true }).then(res => {
                this.depts = res.content.map(function (obj) {
                    if (obj.hasChildren) {
                        obj.children = null
                    }
                    return obj
                })
            })
        },
        getSupDepts(deptId) {
            getDeptSuperior(deptId).then(res => {
                const date = res.content
                this.buildDepts(date)
                this.depts = date
            })
        },
        buildDepts(depts) {
            depts.forEach(data => {
                if (data.children) {
                    this.buildDepts(data.children)
                }
                if (data.hasChildren && !data.children) {
                    data.children = null
                }
            })
        },
        // 获取弹窗内部门数据
        loadDepts({ action, parentNode, callback }) {
            if (action === LOAD_CHILDREN_OPTIONS) {
                getDepts({ enabled: true, pid: parentNode.id }).then(res => {
                    parentNode.children = res.content.map(function (obj) {
                        if (obj.hasChildren) {
                            obj.children = null
                        }
                        return obj
                    })
                    setTimeout(() => {
                        callback()
                    }, 200)
                })
            }
        },
        // 切换部门
        handleNodeClick(data) {
            if (data.pid === 0) {
                this.query.deptId = null
            } else {
                this.query.deptId = data.id
            }
            this.crud.toQuery()
        },
        // 改变状态
        changeEnabled(data, val) {
            this.$confirm('change status : "' + this.dict.label.user_status[val] + '" ' + data.username + ', yes or no ？', 'hint', {
                confirmButtonText: 'submit',
                cancelButtonText: 'cancel',
                type: 'warning'
            }).then(() => {
                crudUser.edit(data).then(res => {
                    this.crud.notify(this.dict.label.user_status[val] + 'success', CRUD.NOTIFICATION_TYPE.SUCCESS)
                }).catch(() => {
                    data.enabled = !data.enabled
                })
            }).catch(() => {
                data.enabled = !data.enabled
            })
        },
        // 获取弹窗内角色数据
        getRoles() {
            getAll().then(res => {
                this.roles = res
            }).catch(() => { })
        },
        // 获取弹窗内岗位数据
        getJobs() {
            getAllJob().then(res => {
                this.jobs = res.content
            }).catch(() => { })
        },
        // 获取权限级别
        getRoleLevel() {
            getLevel().then(res => {
                this.level = res.level
            }).catch(() => { })
        },
        checkboxT(row, rowIndex) {
            return row.id !== this.user.id
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
}
</style>