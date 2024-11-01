<template>
    <div>
        <el-button class="float-button" size="small" @click="handleReturn" type="primary"><i class="el-icon-back" />
            Back</el-button>
        <div class="app-container">
            <div class="book_info_wrapper">
                <el-image class="image" :src="bookVo.book ? baseApi + '/avatar/' + bookVo.book.folder : Folder">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <div class="text">
                    <div class="book_title">{{ bookVo.book == null ? '-' : bookVo.book.title }}</div>
                    <div class="book_author">- Author: {{ bookVo.book == null ? '-' : bookVo.book.author }}</div>
                    <div class="book_secondary_info">- Nation: {{ bookVo.book == null ? '-' : bookVo.book.nation }}
                    </div>
                    <div class="book_secondary_info">- Category: {{ bookVo.book == null ? '-' :
                        categoryFormat(bookVo.book.category) }}</div>
                    <div class="book_secondary_info">- Publisher: {{ bookVo.book == null ? '-' : bookVo.book.publisher
                        }}</div>
                    <div class="book_secondary_info">- Publish time: {{ bookVo.book == null ? '-' :
                        yearFormat(bookVo.book.publishTime) }}</div>
                    <div class="book_secondary_info">- Media type: {{ bookVo.book == null ? '-' :
                        mediaTypeFormat(bookVo.book.mediaType) }}</div>
                </div>
            </div>
            <div class="book_operation">
                <el-button type="primary" size="mini" icon="el-icon-view" @click="handleRead">Read</el-button>
                <el-button type="success" size="mini" icon="el-icon-star-on" :loading="collectLoading"
                    @click="handleCollect">Collect</el-button>
            </div>
            <div class="book_contents_wrapper">
                <div class="book_contents_title">
                    CONTENTS
                </div>
                <div class="book_contents_detail">
                    <div class="book_contents_chapter" v-for="c in bookVo.contents" :key="c.id">
                        <div class="chapter_title">{{ c.chapterTitle }}</div>
                        <div class="chapter_dot"></div>
                        <div class="chapter_page"> {{ c.page }}</div>
                    </div>
                </div>
            </div>
            <div class="user_comments_wrapper">
                <div class="comments_area_ref">COMMENTS</div>
                <div class="comments_item_wrapper" v-for="item in bookVo.comments" :key="item.id">
                    <div class="commnets_user_wrapper">
                        <div class="user_avatar_wrapper">
                            <el-avatar :size="50" style="border-radius: 50%;"
                                :src="item.avatarName ? baseApi + '/avatar/' + item.avatarName : Avatar"></el-avatar>
                        </div>
                        <div class="comments_user_others">
                            <div class="comments_user_nickname">{{ item.nickName }}</div>
                            <div class="commnets_user_publis_time">{{ item.createTime }}</div>
                        </div>
                    </div>
                    <div class="comments_content">
                        <div class="user_rating">
                            <div class="user_rating_title">Rating</div>
                            <div class="user_rating_value">{{ item.rating }}</div>
                        </div>
                        <div class="user_message"> {{ item.content }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 80px;"></div>
        <el-button class="float-button-comment" size="small" @click="handleComment" type="primary">Comment</el-button>
        <el-dialog title="Add Comment" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
            <el-form ref="commentForm" :model="commentForm" label-width="80px" :rules="commentRule">
                <el-form-item label="Rating" prop="rating">
                    <el-input-number v-model.number="commentForm.rating" style="width: 100%" :min="0" :max="100"
                        controls-position="right" />
                </el-form-item>
                <el-form-item label="Content" prop="content">
                    <el-input :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" maxlength="300" show-word-limit
                        v-model="commentForm.content" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="handleSubmit">Submit</el-button>
            </span>
        </el-dialog>
        <!--阅读器-->
        <media-reader v-if="bookVo.book != null" ref="mediaReader" :mediaType="bookVo.book.mediaType" :mediaUrl="bookVo.book.url"/>
    </div>
</template>

<script>
import { addBookComment, addToBookShelf, getBookCategoryDict, getBookDetail } from '@/api/system/job'
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.png'
import Folder from '@/assets/images/folder.png'
import Reader from '@/views/components/Reader'
export default {
    name: 'BookDetail',
    components: {
        'media-reader': Reader
    }, 
    data() {
        return {
            transBookId: '',
            bookVo: {},
            dialogVisible: false,
            commentForm: {},
            commentRule: {
                rating: [
                    { required: true, message: 'please input rating', trigger: 'change' }
                ],
                content: [
                    { required: true, message: 'please input comment', trigger: 'change' }
                ],
            },
            bookCategoryDict: [],
            Avatar: Avatar,
            Folder: Folder,
            collectLoading: false,
            mediaTypeDict: [],
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'updateAvatarApi',
            'baseApi'
        ])
    },
    methods: {
        initBookCategory() {
            getBookCategoryDict({ dictName: 'book_category' }).then(res => {
                this.bookCategoryDict = res
            })
        },
        initBookDetail(id) {
            getBookDetail({ bookId: id }).then(res => {
                this.bookVo = res
            })
        },
        initMediaType() {
            getBookCategoryDict({ dictName: 'media_type' }).then(res => {
                this.mediaTypeDict = res
            })
        },
        handleReturn() {
            this.$router.go(-1)
        },
        handleComment() {
            this.dialogVisible = true
            this.commentForm = {}
        },
        handleSubmit() {
            let param = {
                bookId: this.transBookId,
                comment: this.commentForm
            }
            addBookComment(param).then(res => {
                this.$notify({
                    title: 'Success',
                    message: 'Add Success',
                    type: 'success',
                    duration: 2000
                })
                this.initBookDetail(this.transBookId)
            }).finally(() => {
                this.dialogVisible = false
            })
        },
        yearFormat(value) {
            if (value) {
                let date = new Date(value);
                return date.getFullYear();
            } else {
                return '-'
            }
        },
        categoryFormat(value) {
            if (value) {
                let node = this.bookCategoryDict.find(item => item.value == value)
                if (node)
                    return node.label
                else
                    return 'None'
            } else {
                return 'None'
            }
        },
        mediaTypeFormat(value) {
            if (value) {
                let node = this.mediaTypeDict.find(item => item.value == value)
                if (node)
                    return node.label
                else
                    return 'None'
            } else {
                return 'None'
            }
        },
        handleCollect() {
            let param = {
                userId: this.user.id,
                bookId: this.transBookId,
                collectFlag: 'COLLECT'
            }
            this.collectLoading = true
            addToBookShelf(param).then(res => {
                this.$notify({
                    title: 'Success',
                    message: 'Add Success',
                    type: 'success',
                    duration: 2000
                })
            }).finally(() => {
                this.collectLoading = false
            })
        },
        handleRead() {
            this.$refs['mediaReader'].handleOpen()
        },
    },
    created() {
        this.transBookId = this.$route.params.id
        this.initBookDetail(this.transBookId)
        this.initBookCategory()
        this.initMediaType()
    }

}
</script>
<style lang="scss" scoped>
.float-button {
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
}

.float-button-comment {
    position: fixed;
    bottom: 60px;
    right: 20px;
    padding: 0 !important;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1000;
    width: 70px;
    height: 70px;
}

.app-container {
    margin-top: 20px;
    padding: 0 !important;
    display: grid;
    place-items: center;

    .book_info_wrapper {
        width: 70%;
        display: flex;
        align-items: flex-start;

        .image {
            margin-right: 20px;
            width: 160px;
            height: auto;
        }

        .text {
            padding: 0 !important;
            margin: 0 !important;
            flex-grow: 1;

            .book_title {
                height: 30px;
                line-height: 30px;
                font-size: 18px;
                font-weight: bold;
            }

            .book_author {
                height: 30px;
                line-height: 30px;
                font-size: 16px;
                font-weight: bold;
                color: #007BFF;
            }

            .book_secondary_info {
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #6b6a6a;
            }

        }
    }

    .book_operation {
        margin-top: 30px;
        width: 70%;
    }

    .book_contents_wrapper {
        margin-top: 30px;
        width: 70%;

        .book_contents_title {
            font-size: 20px;
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            border-bottom: 3px solid #007BFF;
        }

        .book_contents_detail {
            font-size: 16px;
            padding: 20px 40px;

            .book_contents_chapter {
                display: flex;
                width: 100%;
                height: 40px;
                line-height: 40px;

                .chapter_title {
                    text-align: start;
                }

                .chapter_dot {
                    flex-grow: 1;
                    text-align: center;
                    border-bottom: 1px dotted #6b6a6a;
                    margin: 0 10px;
                    height: 30px;
                    line-height: 30px;
                }

                .chapter_page {
                    text-align: end;
                    width: 50px;
                }
            }
        }
    }

    .user_comments_wrapper {
        margin-top: 30px;
        width: 70%;

        .comments_area_ref {
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 3px solid #007BFF;
            margin-bottom: 10px;
        }

        .comments_item_wrapper {
            padding: 20px 10px;
            border-bottom: 1px solid rgb(217, 213, 213);

            .commnets_user_wrapper {
                height: 52px;
                display: flex;
                align-items: center;

                .user_avatar_wrapper {
                    width: 70px;
                    height: 52px;
                    text-align: center;
                }

                .comments_user_others {
                    padding: 0 10px;

                    .comments_user_nickname {
                        font-size: 14px;
                        font-weight: bold;
                        color: #007BFF;
                    }

                    .commnets_user_publis_time {
                        font-size: 14px;
                        color: #6b6a6a;
                        height: 24px;
                        line-height: 24px;
                    }
                }
            }

            .comments_content {
                display: flex;
                align-items: flex-start;
                margin-top: 8px;

                .user_rating {
                    width: 70px;
                    text-align: center;

                    .user_rating_title {
                        width: 70px;
                        height: 50px;
                        line-height: 50px;
                        background: #007BFF;
                        color: white;
                        font-size: 16px;
                        text-align: center;
                    }

                    .user_rating_value {
                        width: 70px;
                        height: 40px;
                        line-height: 40px;
                        background: rgb(217, 213, 213);
                        font-size: 16px;
                        text-align: center;
                    }
                }

                .user_message {
                    padding: 10px;
                    color: #6b6a6a;
                    font-size: 16px;
                }
            }
        }
    }
}
</style>