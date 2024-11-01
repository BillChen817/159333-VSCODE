<template>
    <div class="app-container">
        <el-button class="float-button" size="small" @click="handleReturn" type="primary"><i class="el-icon-back" />
            Back</el-button>
        <div class="search_condition">
            Reading Preferences：
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
                @close="handleClose(tag)">
                {{ tag }}
            </el-tag>
            <el-select class="input-new-tag" v-if="inputVisible" placeholder="select" v-model="inputValue"
                ref="saveTagInput" size="small" @change="handleSelectChange">
                <el-option v-for="item in bookCategoryDict" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
        <div class="main_content_wrapper">
            <div class="book_shelf_list">
                <div class="page_ref_title"><i class="el-icon-star-on"></i>Book Shelf</div>
                <div class="book_shelf_item" v-for="book in bookList" :key="book.id">
                    <div class="book_info_wrapper">
                        <el-image class="image" :src="book.folder ? baseApi + '/avatar/' + book.folder : Folder">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div class="text">
                            <div class="book_title">{{ book.title == null ? '-' : book.title }}</div>
                            <div class="book_author">- Author: {{ book.author == null ? '-' : book.author }}</div>
                            <div class="book_secondary_info">- Category: {{ book.category == null ? '-' :
                                categoryFormat(book.category) }}</div>
                            <div class="book_secondary_info">- Nation: {{ book.nation == null ? '-' : book.nation }}
                            </div>
                            <div class="book_secondary_info">- Publisher: {{ book.publisher == null ? '-' :
                                book.publisher }}</div>
                            <div class="book_secondary_info">- Publication time: {{ book.publishTime == null ? '-' :
                                yearFormat(book.publishTime) }}</div>
                            <div style="text-align: left;margin-top: 10px;">
                                <el-button type="primary" size="mini" icon="el-icon-view"
                                    @click="handleRead(book)">Read</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                    @click="handleRemoveCollect(book)">Remove</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination :hide-on-single-page="true" background style="margin-top: 15px;"
                    @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size"
                    layout="prev, pager, next" :total="search.total">
                </el-pagination>
            </div>
            <!-- <div class="recommend_book_list">
                <div class="page_ref_title"><i class="el-icon-question"></i> Guess you like</div>
                <div class="recommend_book_item" v-for="book in recommendList" :key="book.id"
                    @click="handleClick(book)">
                    <div class="book_item_title">{{ book.title }}</div>
                    <div class="book_item_author">{{ book.author }}</div>
                </div>
            </div> -->
        </div>
        <!--阅读器-->
        <media-reader v-if="selectedBook != null" ref="mediaReader" :mediaType="selectedBook.mediaType"
            :mediaUrl="selectedBook.url" />
    </div>
</template>

<script>
import { listBookShelf, listCategories, addToBookShelf, getBookCategoryDict, listAuthors, listFavorite, addFavorite, removeFavorite, listRecommend, generateRecommend } from '@/api/system/job'
import { mapGetters } from 'vuex'
import Folder from '@/assets/images/folder.png'
import { Loading } from 'element-ui'
import Reader from '@/views/components/Reader'

export default {
    name: 'BookShelf',
    components: {
        'media-reader': Reader
    },
    computed: {
        ...mapGetters([
            'user',
            'updateAvatarApi',
            'baseApi'
        ])
    },
    data() {
        return {
            authorList: [],
            categoryList: [],
            search: {
                page: 0,
                total: 0,
                size: 5,
                author: null,
                category: null
            },
            bookList: [],
            bookCategoryDict: [],
            Folder: Folder,
            globalLoading: null,
            selectedBook: null,
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            recommendList: []
        }
    },
    methods: {
        initRecommend() {
            listRecommend({ userId: this.user.id }).then(res => {
                this.recommendList = res
                console.log(res)
            })
        },
        initFavorite() {
            listFavorite({ userId: this.user.id }).then(res => {
                this.dynamicTags = res
            })
        },
        initSelectableAuthors() {
            listAuthors({ userId: this.user.id }).then(res => {
                this.authorList = res
            })
        },
        initSelectableCategories() {
            listCategories({ userId: this.user.id }).then(res => {
                this.categoryList = res
            })
        },
        initBookCategory() {
            getBookCategoryDict({ dictName: 'book_category' }).then(res => {
                this.bookCategoryDict = res
            })
        },
        initBookShelf() {
            this.$set(this.search, 'userId', this.user.id)
            this.showLoading()
            listBookShelf(this.search).then(res => {
                this.bookList = res.content
                this.search.total = res.totalElements
            }).finally(() => {
                this.closeLoading()
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
        handleCurrentChange() {
            this.initBookShelf()
        },
        showLoading() {
            // 显示加载状态，这里默认是添加到body上  
            this.globalLoading = Loading.service({
                lock: true, // 是否锁屏  
                text: 'Loading...', // 显示的文字  
                spinner: 'el-icon-loading', // 自定义加载图标类名  
                background: 'rgba(0, 0, 0, 0.7)', // 遮罩层背景色  
            });
        },
        closeLoading() {
            if (this.globalLoading)
                this.globalLoading.close()
        },
        handleRemoveCollect(book) {
            addToBookShelf({ userId: this.user.id, bookId: book.id, collectFlag: 'REMOVE' }).then(res => {
                this.initBookShelf()
            })
        },
        recommend() {
            generateRecommend({ userId: this.user.id }).then(res => {
                console.log('generate recommend...', res)
            })
        },
        handleRead(val) {
            this.selectedBook = val
            this.$nextTick(() => {
                // 现在可以安全地访问和修改更新后的DOM  
                this.$refs['mediaReader'].handleOpen()
            })
        },
        handleClose(tag) {
            let inputValue = this.bookCategoryDict.find(item => item.label === tag)
            if (inputValue) {
                removeFavorite({ userId: this.user.id, value: inputValue.value }).then(res => {
                    this.initFavorite()
                })
            }
        },

        showInput() {
            this.inputVisible = true;
        },

        handleSelectChange() {
            let inputValue = this.inputValue;
            if (inputValue) {
                addFavorite({ userId: this.user.id, value: inputValue }).then(res => {
                    this.initFavorite()
                    this.inputVisible = false;
                    this.inputValue = '';
                })
            }
        },
        handleClick(book) {
            this.$router.push('/book/detail/' + book.id);
        },
        handleReturn() {
            this.$router.go(-1)
        },
    },
    created() {
        this.initBookShelf()
        this.initSelectableAuthors()
        this.initSelectableCategories()
        this.initBookCategory()
        this.initFavorite()
        this.initRecommend()
        this.recommend()
    }
}
</script>
<style lang="scss" scoped>
.app-container,
body,
html {
    background: var(--WR_BC23, #f4f5f7);
}

.app-container {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 80px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .float-button {
        position: fixed;
        top: 20px;
        right: 10px;
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }

    .search_condition {
        width: 80%;
        min-height: 50px;
        line-height: 50px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .by_author {
            width: 250px;
            margin-right: 15px;
        }

        .by_category {
            width: 250px;
        }

        .el-tag {
            height: 32px;
            line-height: 30px;
        }

        .el-tag+.el-tag {
            height: 32px;
            line-height: 30px;
            margin-left: 10px;
        }

        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }

        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
    }

    .main_content_wrapper {
        width: 80%;
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;

        .book_shelf_list,
        .recommend_book_list {
            flex-basis: 0;
            /* flex-basis设置为0，以便flex-grow能按比例分配空间 */
            flex-grow: 1;
            /* 初始设置为相等，后面通过媒体查询修改 */
            min-width: 0;
            /* 防止内容过少时div不收缩 */
            /* 添加一些内边距，让内容看起来更舒适 */
            box-sizing: border-box;

            /* 让padding和border包含在width内 */
        }

        .book_shelf_list {
            margin-right: 20px;

            .book_info_wrapper {
                border: 1px solid rgb(217, 213, 213);
                display: flex;
                align-items: flex-start;
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 5px;

                .image {
                    margin-right: 20px;
                    width: 120px;
                    height: auto;
                }

                .text {
                    padding: 0 !important;
                    margin: 0 !important;
                    flex-grow: 1;

                    .book_title {
                        height: 28px;
                        line-height: 28px;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .book_author {
                        height: 26px;
                        line-height: 26px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #007BFF;
                    }

                    .book_secondary_info {
                        height: 26px;
                        line-height: 26px;
                        font-size: 14px;
                        color: #6b6a6a;
                    }

                }
            }

            .navi_container {
                height: 100px;
                position: fixed;
                bottom: 0px;
                padding: 0 !important;
            }

        }

        .page_ref_title {
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 3px solid #007BFF;
            margin-bottom: 20px;
        }

        .recommend_book_list {
            padding: 0 20px;

            .recommend_book_item {
                border-bottom: 1px solid rgb(217, 213, 213);
                line-height: 40px;
                height: 40px;
                display: flex;
                align-items: flex-start;

                .book_item_title {
                    padding: 0 !important;
                    margin: 0 !important;
                    flex-grow: 1;
                    overflow: hidden;
                    /* 超出部分隐藏 */
                    text-overflow: ellipsis;
                    /* 显示省略号 */
                    white-space: nowrap;
                    /* 保持文本在一行内显示，不允许换行 */
                    font-size: 14px;
                    color: #6b6a6a;
                    padding: 10px;
                }

                .book_item_author {
                    min-width: 100px;
                    text-align: right;
                    font-size: 16px;
                    color: #007BFF;
                }
            }

            .recommend_book_item:hover {
                cursor: pointer;
            }
        }

        /* 较大屏幕时，左侧占70%，右侧占30% */
        @media (min-width: 600px) {
            .book_shelf_list {
                flex-grow: 7;
            }

            .recommend_book_list {
                flex-grow: 3;
            }
        }

        /* 较小屏幕时，两者都占100% */
        @media (max-width: 599px) {

            .recommend_book_list,
            .recommend_book_list {
                flex-basis: 100%;
                flex-grow: 0;
                /* 不再需要按比例增长 */
            }
        }
    }
}
</style>
