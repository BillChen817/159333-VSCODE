<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container" style="margin: 15px;">
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">
                Add
            </el-button>
        </div>
        <div style="margin: 15px;">
            <!--表格渲染-->
            <el-table ref="table" v-loading="listLoading" :data="listData" style="width: 100%;height: 100%;">
                <el-table-column :show-overflow-tooltip="true" prop="title" label="Title" width="180"/>
                <el-table-column :show-overflow-tooltip="true" prop="category" label="Category" width="130" :formatter="categoryFormat" />
                <el-table-column :show-overflow-tooltip="true" prop="author" label="Author" width="130"/>
                <el-table-column :show-overflow-tooltip="true" prop="nation" width="100" label="Nation"/>
                <el-table-column :show-overflow-tooltip="true" prop="publisher" width="135" label="Publisher" />
                <el-table-column :show-overflow-tooltip="true" prop="publishTime" width="135" label="PublishTime"
                    :formatter="yearFormat" />
                <el-table-column :show-overflow-tooltip="true" prop="folder" label="Folder">
                    <template slot-scope="scope">
                        <img style="width: 60px; height: 100px;"
                            :src="scope.row.folder ? baseApi + '/avatar/' + scope.row.folder : Folder"
                            class="user-avatar">
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" width="135" prop="url" label="BookUrl" />
                <el-table-column :show-overflow-tooltip="true" prop="uploadTime" width="135" label="UploadTime"
                    :formatter="yyyyMMddFormat" />
                <el-table-column label="Operation" width="340" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="filter-item" size="mini" type="success" icon="el-icon-edit"
                            @click="handleUpdate(scope.row)">
                            Update
                        </el-button>
                        <el-button class="filter-item" size="mini" type="primary" plain icon="el-icon-tickets"
                            @click="handleEditContents(scope.row)">
                            Contents
                        </el-button>
                        <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination style="margin: 15px 0;" background layout="prev, pager, next"
                :current-page.sync="search.page" :page-size="search.size" :total="search.total"
                @current-change="initBooks" />
            <!--书籍表单-->
            <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialogVisible"
                :title="textMap[dialogUsed]" width="600px">
                <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                    <el-form-item label="title" prop="title">
                        <el-input v-model="form.title" />
                    </el-form-item>
                    <el-form-item label="category" prop="category">
                        <el-select v-model="form.category" placeholder="select" style="width: 100% !important">
                            <el-option v-for="item in bookCategoryDict" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="author" prop="author">
                        <el-input v-model="form.author" />
                    </el-form-item>
                    <el-form-item label="nation" prop="nation">
                        <el-input v-model="form.nation" />
                    </el-form-item>
                    <el-form-item label="publisher" prop="publisher">
                        <el-input v-model="form.publisher" />
                    </el-form-item>
                    <el-form-item label="publishTime" prop="publishTime">
                        <el-date-picker style="width: 100%" v-model="form.publishTime" type="year"
                            placeholder="select publish time">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="folder" prop="folder">
                        <el-upload action="/api/books/uploadFolder" class="avatar-uploader" :show-file-list="false"
                            :on-success="handleFolderSuccess" :before-upload="beforeFolderUpload"
                            :headers="uploadHeader">
                            <img style="width: 120px; height: 168px;"
                                :src="form.folder ? baseApi + '/avatar/' + form.folder : Folder" class="user-avatar">
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="mediaType" prop="mediaType">
                        <el-select v-model="form.mediaType" placeholder="select" style="width: 100% !important">
                            <el-option v-for="item in mediaTypeDict" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="sample" prop="sample">
                        <el-upload action="/api/books/uploadBook" :multiple="false" class="upload-demo" drag
                            :show-file-list="true" :on-success="handleSampleSuccess" :before-upload="beforeBookUpload"
                            :file-list="sampleList" :headers="uploadHeader">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drag the sample chapter here，or <em>click to upload</em></div>
                            <div class="el-upload__tip" slot="tip">Only PDF files can be uploaded, and they should not
                                exceed 10mb
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="book" prop="url">
                        <el-upload action="/api/books/uploadBook" :multiple="false" class="upload-demo" drag
                            :show-file-list="true" :on-success="handleBookSuccess" :before-upload="beforeBookUpload"
                            :file-list="fileList" :headers="uploadHeader">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drag the file here，or <em>click to upload</em></div>
                            <div class="el-upload__tip" slot="tip">Only PDF files can be uploaded, and they should not
                                exceed 10mb
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="handleCancel">Cancel</el-button>
                    <el-button type="primary" :loading="submitLoading"
                        @click="handleAddOrUpdateSubmit">Submit</el-button>
                </div>
            </el-dialog>
            <!--目录列表-->
            <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="contentsVisable"
                title="Contents-Edit" width="700px">
                <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus"
                    @click="handleAddContents()">
                    Add
                </el-button>
                <el-table ref="contents" :data="contents" style="width: 100%;height: 100%;">
                    <el-table-column :show-overflow-tooltip="true" prop="chapterTitle" label="Title" />
                    <el-table-column :show-overflow-tooltip="true" prop="page" label="Page" />
                    <el-table-column label="Operation" width="240">
                        <template slot-scope="scope">
                            <el-button class="filter-item" size="mini" type="success" icon="el-icon-edit"
                                @click="handleUpdateContents(scope.row)">
                                Update
                            </el-button>
                            <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDeleteContents(scope.row)">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <!--新增目录-->
            <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="contentsAddVisable"
                :title="contentsFormTitle[contentsDialogUsed]" width="600px">
                <el-form ref="contentsForm" :model="contentsForm" :rules="contentsRules" label-width="110px">
                    <el-form-item label="title" prop="chapterTitle">
                        <el-input v-model="contentsForm.chapterTitle" />
                    </el-form-item>
                    <el-form-item label="page" prop="page">
                        <el-input v-model="contentsForm.page" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="handleContentsCancel">Cancel</el-button>
                    <el-button type="primary" :loading="contentsAddLoading"
                        @click="handleAddContentsSubmit">Submit</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getAllBooks, createBook, deleteBook, getBookContents, addBookContents, updateBookContents, deleteBookContents, getBookCategoryDict } from '@/api/system/job'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import Folder from '@/assets/images/folder.png'

export default {
    name: 'bookUsers',
    data() {
        return {
            height: document.documentElement.clientHeight - 180 + 'px;',
            rules: {
                title: [
                    { required: true, message: 'please input title', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: 'please input author', trigger: 'blur' }
                ],
                category: [
                    { required: true, message: 'please input category', trigger: 'blur' }
                ],
                folder: [
                    { required: true, message: 'please upload folder', trigger: 'blur' }
                ],
                nation: [
                    { required: true, message: 'Please enter the author\'s nationality', trigger: 'blur' }
                ],
                publisher: [
                    { required: true, message: 'please input publisher', trigger: 'blur' }
                ],
                publishTime: [
                    { required: true, message: 'please input publish time', trigger: 'blur' }
                ],
                mediaType: [
                    { required: true, message: 'please select media type', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: 'please upload book', trigger: 'blur' }
                ],
                sample: [
                    { required: true, message: 'please upload sample chapter', trigger: 'blur' }
                ],
            },
            listLoading: false,
            listData: [],
            search: {
                page: 0,
                total: 0,
                size: 5
            },
            textMap: {
                create: 'Add',
                update: 'Update'
            },
            dialogVisible: false,
            dialogUsed: 'create',
            uploadHeader: {
                'Authorization': getToken()
            },
            form: {
                folder: null,
                url: null
            },
            Folder: Folder,
            submitLoading: false,
            selectedRow: {},
            fileList: [],
            sampleList:[],
            contentsVisable: false,
            contents: [],
            contentsAddVisable: false,
            contentsForm: {},
            contentsRules: {
                chapterTitle: [
                    { required: true, message: 'please input chapter title', trigger: 'blur' }
                ],
                page: [
                    { required: true, message: 'please input page', trigger: 'blur' }
                ],
            },
            contentsAddLoading: false,
            contentsFormTitle: {
                add: 'Contents-Add',
                update: 'Contents-Update'
            },
            contentsDialogUsed: 'add',
            bookCategoryDict: [],
            mediaTypeDict: [],
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'baseApi'
        ])
    },
    created() {
        this.initBooks()
        this.initBookCategory()
        this.initMediaType()
    },
    mounted: function () {
        const that = this
        window.onresize = function temp() {
            that.height = document.documentElement.clientHeight - 180 + 'px;'
        }
    },
    methods: {
        initBookCategory() {
            getBookCategoryDict({ dictName: 'book_category' }).then(res => {
                this.bookCategoryDict = res
            })
        },
        initMediaType() {
            getBookCategoryDict({ dictName: 'media_type' }).then(res => {
                this.mediaTypeDict = res
            })
        },
        initBooks() {
            this.listLoading = true
            getAllBooks(this.search).then(res => {
                this.search.total = res.totalElements
                this.listData = res.content
            }).finally(() => {
                this.listLoading = false
            })
        },
        handleAdd() {
            this.dialogVisible = true
            this.form = { folder: null, url: null }
        },
        handleAddOrUpdateSubmit() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.folder == null) {
                        this.$message.warning('Please upload folder.')
                        return
                    }
                    if (this.form.url == null) {
                        this.$message.warning('Please upload book.')
                        return
                    }
                    this.submitLoading = true
                    createBook(this.form).then(res => {
                        this.initBooks()
                        this.dialogVisible = false
                        this.fileList = []
                        this.$notify({
                            title: 'Success',
                            message: 'Add Success',
                            type: 'success',
                            duration: 2000
                        })
                    }).finally(() => {
                        this.submitLoading = false
                    })
                }
            })
        },
        handleCancel() {
            this.dialogVisible = false
            this.form = {}
        },
        handleFolderSuccess(res) {
            this.form.folder = res.folder
        },
        beforeFolderUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isLg2M = file.size / 1024 / 1024 > 2

            if (!isJPG && !isPNG) {
                this.$message.error('Book folder must be .jpg or .png')
                return false
            }

            if (isLg2M) {
                this.$message.error('Book folder size must be smaller then 2mb')
                return false
            }
        },

        handleBookSuccess(res, file, fileList) {
            this.form.url = res.url
        },
        handleSampleSuccess(res, file, fileList) {
            this.form.sample = res.url
        },
        beforeBookUpload(file) {
            let isLegal = false
            let msg = ''
            if (this.form.mediaType == '1') {
                isLegal = file.type === 'application/pdf'
                msg = 'Book must be .pdf'
            } else if (this.form.mediaType == '2') {
                isLegal = file.type === 'audio/mpeg'
                msg = 'The audio book format must be audio/mpeg.'
            } else if(this.form.mediaType == '3') {
                isLegal = file.type === 'video/mp4'
                msg = 'The video book format must be MP4.'
            } else {
                msg = 'Please select the media format first.'
            }

            if (!isLegal) {
                this.$message.error(msg)
                return false
            }

            const isLg200M = file.size / 1024 / 1024 > 200

            if (isLg200M) {
                this.$message.error('Book file size must be smaller then 10mb')
                return false
            }
        },

        handleUpdate(row) {
            this.dialogUsed = 'update'
            this.dialogVisible = true
            this.form = { ...row }
            this.fileList = []
            this.fileList.push({ name: row.url, url: '' })
        },

        handleDelete(row) {
            this.$confirm("Are you sure you want to delete it?", "Tips", {
                confirmButtonText: 'Sure',
                cancelButtonText: 'Cancel',
                type: 'warn'
            }).then(() => {
                deleteBook({ id: row.id }).then(res => {
                    this.initBooks()
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Success',
                        type: 'success',
                        duration: 2000
                    })
                })
            })
        },
        handleEditContents(row) {
            this.selectedBookId = row.id
            getBookContents({ bookId: this.selectedBookId }).then(res => {
                this.contentsVisable = true
                this.contents = res
            })
        },
        initBookContents(id) {
            getBookContents({ bookId: id }).then(res => {
                this.contents = res
            })
        },
        handleAddContents() {
            this.contentsForm = {}
            this.contentsAddVisable = true
            this.contentsDialogUsed = 'add'
        },
        handleContentsCancel() {
            this.contentsAddVisable = false
        },
        handleAddContentsSubmit() {
            if (this.contentsDialogUsed == 'add') {
                this.$set(this.contentsForm, 'bookId', this.selectedBookId)
                this.contentsAddLoading = true
                addBookContents(this.contentsForm).then(res => {
                    this.$notify({
                        title: 'Success',
                        message: 'Add Success',
                        type: 'success',
                        duration: 2000
                    })
                    this.initBookContents(this.contentsForm.bookId)
                }).finally(() => {
                    this.contentsAddLoading = false
                    this.contentsAddVisable = false
                })
            } else {
                updateBookContents(this.contentsForm).then(res => {
                    this.$notify({
                        title: 'Success',
                        message: 'Update Success',
                        type: 'success',
                        duration: 2000
                    })
                    this.contentsAddVisable = false
                    this.initBookContents(this.contentsForm.bookId)
                })
            }

        },
        handleUpdateContents(row) {
            this.contentsDialogUsed = 'update'
            this.contentsAddVisable = true
            this.contentsForm = { ...row }
        },
        handleDeleteContents(row) {
            this.$confirm("Are you sure you want to delete it?", "Tips", {
                confirmButtonText: 'Sure',
                cancelButtonText: 'Cancel',
                type: 'warn'
            }).then(() => {
                deleteBookContents({ contentsId: row.id }).then(res => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Success',
                        type: 'success',
                        duration: 2000
                    })
                    this.initBookContents(row.bookId)
                })
            })
        },
        categoryFormat(row, column, value) {
            if (value) {
                let node = this.bookCategoryDict.find(item => item.value == value)
                if (node)
                    return node.label
                else 
                   return '-'
            } else {
                return '-'
            }
        },
        yearFormat(row, column, value) {
            if (value) {
                let date = new Date(value);
                return date.getFullYear();
            } else {
                return '-'
            }
        },
        yyyyMMddFormat(row, column, value) {
            if (value) {
                let date = new Date(value)
                let year = date.getFullYear()
                let month = String(date.getMonth() + 1).padStart(2, '0') // 月份加1并确保是两位数  
                let day = String(date.getDate()).padStart(2, '0') // 确保是两位数  
                return `${year}-${month}-${day}`
            } else {
                return '-'
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
}

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
</style>
