<template>
    <div class="index_page_wrapper">
        <!--头部-->
        <div class="index_page_header_wrapper">
            <div class="index_page_header_inner_wrapper">
                <div class="index_page_header_wrapper_title">
                    <span v-if="!queryBackBar">Enjoy Reading</span>
                </div>
                <div class="index_page_header_search_wrapper">
                    <div v-show="queryBackBar" class="index_page_header_search_back" @click="handleBack">
                        <svg data-v-ee3ca842="" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            class="index_page_header_search_back_icon">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M18.2051 10.0364L11.5649 15.5699L4.92471 10.0364L6.20508 8.5L11.5649 12.9665L16.9247 8.5L18.2051 10.0364Z"
                                fill="currentColor" />
                        </svg>
                    </div>
                    <div class="index_page_search_bar_wrapper">
                        <div class="index_page_search_bar_icon" />
                        <form style="flex:1" @submit.prevent="handleChange">
                            <el-input v-model="queryKey" value placeholder="Search..." @input="handleInput()"
                                class="index_page_search_bar_input" />
                        </form>
                        <div v-if="queryActionBar" class="index_page_search_bar_action">
                            <div class="index_page_search_bar_action_icon"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--查询结果列表-->
        <div v-show="queryBackBar" class="search_content_wrapper">
            <div v-if="queryResult.length > 0" class="search_content_card_wrapper">
                <div class="search_content_card_header">
                    <div class="search_content_card_header_title">Result</div>
                    <div class="search_content_card_header_extra"></div>
                </div>
                <div class="search_content_card_content">
                    <div v-for="item in queryResult" :key="item.id" class="search_content_card_content_item"
                        @click="handleDetail(item)">
                        <a href="#" target="_self" class="index_page_mini_bookInfo">
                            <div class="index_page_mini_bookInfo_cover_wrapper">
                                <div class="bookCover index_page_mini_bookInfo_cover_pic">
                                    <img :src="item.folder ? baseApi + '/avatar/' + item.folder : Folder"
                                        class="bookCover_img" :alt="item.title">
                                    <span class="bookCover_decor bookCover_gradientDecor bookCover_borderDecor"></span>
                                </div>
                            </div>
                            <div class="index_page_mini_bookInfo_content_wrapper">
                                <div class="index_page_mini_bookInfo_content_info">
                                    <div class="index_page_mini_bookInfo_content_info_meta">
                                        <div class="index_page_mini_bookInfo_content_title">
                                            <span>{{ item.title }}</span>
                                        </div>
                                        <div class="index_page_mini_bookInfo_content_author">
                                            <span>{{ item.author }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!--主体-->
        <div class="index_page_content_wrapper">
            <div v-show="!queryBackBar" class="index_page_top_section_wrapper">
                <div class="index_page_top_section_header_wrapper">
                    <div class="index_page_top_section_header_title">
                        <div class="index_page_top_section_header_title_lang">Guess you like ?</div>
                        <div class="index_page_top_section_header_title_action">
                            <div class="index_page_top_section_header_title_action_lang">
                                <div style="cursor: pointer;" @click="handleRefresh">Refresh</div>
                            </div>
                        </div>
                    </div>
                    <div class="index_page_top_section_header_action">
                        <a v-show="!isLogin" href="/login" class="index_page_top_section_header_action_link">Login</a>
                        <div v-show="!isLogin" class="index_page_top_section_header_action_link_sep"></div>
                        <a href="/admin" class="index_page_top_section_header_action_link">Admin</a>
                        <div v-show="isLogin" class="index_page_top_section_header_action_link_sep"></div>
                        <a v-show="isLogin" href="#" @click="logout"
                            class="index_page_top_section_header_action_link">Logout</a>
                        <div v-if="isLogin" class="index_page_top_section_header_action_link_sep"></div>
                        <a v-if="isLogin" href="/shelf" class="index_page_top_section_header_action_link">Shelf</a>
                        <div v-if="isLogin" class="index_page_top_section_header_action_link_sep"></div>
                        <!-- <a v-if="isLogin" href="/admin" class="index_page_top_section_header_action_link">Admin</a>
                        <div v-if="isLogin" class="index_page_top_section_header_action_link_sep"></div> -->
                        <a v-if="isLogin" href="/profile" class="index_page_top_section_header_action_link">Profile</a>
                    </div>
                </div>
                <!--猜你喜欢-->
                <div class="index_page_top_section_content_wrapper">
                    <div class="index_page_top_section_content">
                        <div class="index_page_top_section_content_suggestions">
                            <div @click="handleDetail(item)" v-for="item in recommendList" :key="item.id"
                                class="suggestion_card_wrapper">
                                <div class="suggestion_card_content">
                                    <div class="bookCover suggestion_card_cover">
                                        <img :src="item.folder ? baseApi + '/avatar/' + item.folder : Folder"
                                            class="bookCover_img" alt="Book Folder">
                                        <span
                                            class="bookCover_decor bookCover_gradientDecor bookCover_borderDecor"></span>
                                    </div>
                                    <div class="suggestion_card_content_info">
                                        <div class="suggestion_card_content_title">{{ item.title }}</div>
                                        <div class="suggestion_card_content_author">{{ item.author }}</div>
                                        <!-- <div class="suggestion_card_content_reason">大家都在读</div> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--尾部-->
        <div class="index_page_footer_wrapper"></div>
        <!-- 借阅记录 -->
        <el-button v-if="isLogin" class="float-button" @click="handleBrHistory">
            Borrow history
            <span v-if="showDueTips" class="red-dot"></span>
        </el-button>
        <el-drawer title="Borrow History" :visible.sync="brHistory" direction="rtl" size="50%">
            <el-table style="margin: 10px" :data="borrowList">
                <el-table-column property="bookName" label="title" width="200"
                    show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="dueTime" label="dueTime" width="160"></el-table-column>
                <el-table-column property="overStatus" label="dueStatus" width="90"></el-table-column>
                <el-table-column property="loanStatus" label="loanStatus" width="90"></el-table-column>
                <el-table-column align="center" label="operation" width="130">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.loanStatus === 'Unreturned'" type="danger" size="mini"
                            @click="handleReturn(scope.row)">Return</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth' // getToken from cookie
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import Folder from '@/assets/images/folder.png'
import Avatar from '@/assets/images/avatar.png'
import { listRecommend, generateRecommend, refreshRecommend, queryBook, listBorrowHistory, returnBook, hasDueRecord } from '@/api/system/job'

export default {
    name: 'ReaderQuery',
    data() {
        return {
            queryKey: '',
            queryActionBar: false,
            queryBackBar: false,
            isPinned: false,
            recommendList: [],
            globalLoading: null,
            Avatar: Avatar,
            Folder: Folder,
            queryResult: [],
            brHistory: false,
            borrowList: [],
            showDueTips: false,
        }
    },
    computed: {
        isLogin: function () {
            return getToken() != null
        },
        isAdmin: function () {
            return this.user.isAdmin
        },
        ...mapGetters([
            'user',
            'updateAvatarApi',
            'baseApi'
        ])
    },
    created() {
        this.initRecommend()
        if (this.isLogin) {
            hasDueRecord({ userId: this.user.id }).then(res => {
                if (res) {
                    this.showDueTips = true
                } else {
                    this.showDueTips = false
                }
            })
        }
    },
    methods: {
        handleInput() {
            if (this.queryKey != null && this.queryKey.trim() != '') {
                this.queryActionBar = true
            } else {
                this.queryActionBar = false
            }
        },
        handleChange() {
            this.queryBackBar = true
            this.isPinned = true
            queryBook({ key: this.queryKey }).then(res => {
                console.log(res)
                this.queryResult = res
            })
        },
        handleBack() {
            this.queryKey = ''
            this.queryBackBar = false
            this.isPinned = false
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload()
            })
        },
        initRecommend() {
            this.showLoading()
            listRecommend({ userId: this.user.id }).then(res => {
                this.recommendList = res
            }).finally(() => {
                this.closeLoading()
            })
        },
        handleRefresh() {
            this.showLoading()
            refreshRecommend({ userId: this.user.id }).then(res => {
                this.recommendList = res
            }).finally(() => {
                this.closeLoading()
            })
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
        handleDetail(item) {
            this.$router.push('/detail/' + item.id);
        },
        handleBrHistory() {
            listBorrowHistory({ userId: this.user.id }).then(res => {
                this.borrowList = res
                this.brHistory = true
            })
        },
        handleReturn(row) {
            let params = {
                userId: this.user.id,
                bookId: row.bookId
            }
            this.borrowing = true
            returnBook(params).then(res => {
                this.handleBrHistory()
            })
        }
    }
}
</script>

<style>
.el-input--small .el-input__inner {
    border: none;
}
</style>

<style lang="scss" scoped>
.index_page_wrapper,
body,
html {
    background: var(--WR_BC23, #f4f5f7);
}

// 最外层包裹
.index_page_wrapper {
    box-sizing: border-box;
    min-height: 100vh;
    padding-top: 180px;
    position: relative;

    .float-button {
        position: fixed;
        bottom: 30px;
        left: 20px;
        height: 80px;
        width: 80px;
        line-height: 16px;
        border-radius: 50%;
        // background-color: #007BFF;
        // color: white;
        // border: none;
        // border-radius: 5px;
        white-space: normal;
        /* 允许文本换行 */
        word-break: break-all;
        /* 文本换行方式 */
        cursor: pointer;
        z-index: 1000;

        .red-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
            /* 使红点变成圆形 */
            display: block;
        }
    }

    // 头部包裹
    .index_page_header_wrapper {
        background: var(--WR_BC22, #edeef0);
        box-sizing: border-box;
        display: flex;
        // height: 300px;
        justify-content: center;
        overflow: auto;
        position: absolute;
        top: 0;
        transition: all .3s ease;
        width: 100%;
        z-index: 10;
        -ms-overflow-style: none;
        -o-overflow: hidden;
        scrollbar-width: none;
        align-items: center;
        padding-bottom: 30px;

        .index_page_header_inner_wrapper {
            align-items: center;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            max-width: 740px;

            .index_page_header_wrapper_title {
                // background: url('../../assets/images/logo_index.jpg');
                /* 假设图片在名为'images'的文件夹中 */
                background-size: cover;
                /* 覆盖整个元素区域，根据需要调整 */
                background-position: center;
                /* 图片居中显示 */
                height: 34px;
                margin-bottom: 16px;
                margin-top: 24px;
                transition: opacity .3s ease;
                width: 200px;
                line-height: 34px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                color: #1b2c7b;
            }

            .index_page_header_search_wrapper {
                background: var(--WR_BC22, #edeef0);
                display: flex;
                position: relative;
                margin-top: 10px;
                width: 100%;
                transition: top 0.3s ease;
                /* 平滑过渡效果 */

                .index_page_header_search_back {
                    align-items: center;
                    cursor: pointer;
                    display: flex;
                    flex-shrink: 0;
                    height: 50px;
                    justify-content: center;
                    left: -46px;
                    position: absolute;
                    transition: opacity .3s ease;
                    width: 50px;

                    .index_page_header_search_back_icon {
                        color: var(--WR_BC17, #99a0aa);
                        transform: rotate(90deg);
                    }
                }

                .index_page_search_bar_wrapper {
                    align-items: center;
                    background: var(--WR_BC1, #fff);
                    border-radius: 61px;
                    box-sizing: border-box;
                    display: flex;
                    margin-left: auto;
                    height: 48px;
                    padding: 10px 10px 10px 15px;
                    transition: width .3s ease;
                    width: 100%;

                    .index_page_search_bar_icon {
                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHKSURBVHgB1ZVBUsJAEEV7BmHNEeIJhBMIJ1AWUuWObLQoF+AJIDeQFVW6CKxcuEBPEG4gNzBHYKshabszEypSZCaFuPBXhUyY7n6ZTk8PwH+XKJp48l9aNHuRAF7So6ONVwByFWPF67udEA4B+P6i/iU2IwAcWlwfanjiuW5nbbKSu8EjEQU6+DpB9BIU7dteV/C1QWgC4lxZ45Bt2ccEOMk/qDeHBl1hgnG7716H+fk7t0spgt7Ufx5LUQmQbLXPfRFgm6Kpv3CkiD54TMFPd4PviiBkX3mnYZ1X2XevlvvstimqiHikiTNbcFZqgzhJfVUhgBFAOW2oG0ygpBKQy9SFqs0KQA24UXkupVxaHCvgr5QHhPwz5Q1WUo/+oqGHKysAEd7UH0kLykrEg/RWCgDiVTmJAZcsWMQ2CEmPxzHGnhXAHwxVBdVpPwQmiN4zgX57Y1n/6EWqVWyCrKIEyBlgMskqK22AEs6phXAryVoE7fpqu6j57W12nxCNhYABGMSrFar+HROksF2nrQAkgeRZtiIOJKgYYvpenFLdLgITpBBQVjbIrwE2yFEA+yA1rDb5MDpaq+BS5TME0hXg3HbSHSzbCXd0fQNEp+nQP2KvugAAAABJRU5ErkJggg==) no-repeat;
                        background-size: 100%;
                        height: 24px;
                        margin-right: 12px;
                        width: 24px;
                    }

                    form {
                        display: block;
                        margin-top: 0em;
                        unicode-bidi: isolate;

                        .index_page_search_bar_input {

                            background: transparent;
                            color: var(--WR_BC3, #212832);
                            font-size: 16px;
                            font-weight: 500;
                            text-align: start;
                            width: 100%;
                        }

                        input,
                        textarea {
                            border: 0;
                            margin: 0;
                            outline: 0;
                            padding: 0;
                        }
                    }

                    .index_page_search_bar_action {
                        background: var(--WR_BC42, rgba(13, 20, 30, .04));
                        border-radius: 9999px;
                        height: 32px;
                        margin-left: 12px;
                        width: 32px;

                        .index_page_search_bar_action_icon {
                            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADTSURBVHgB7dTNDYIwFAfwVxTPjsAKbqAjcPQGR6dwDGI4VE4mcmAERnAEO4JHA7G1zxMHYh/JI9Hk/RJSSJq+P/0CEEII8W+0btahPoVuklLXW2xDfSOYAAfsVH8rq/r4fdAus8q12AJXACweqb71r4l1LqPMBAUpwLC4f4x1r12epw9gEAwwVvyQ7w0wWQK9OPLfi/vpfAUugRl4wtxUqEOhL/jXgyWI/RKkBpgEA8wdghRgLMTKxRuOk0C+B3Dn4wmAzwy4iusYTsZ1AQkhxM94A+y4Xp2L0yGAAAAAAElFTkSuQmCC) no-repeat;
                            background-size: 100%;
                            height: 100%;
                            width: 100%;
                        }
                    }
                }
            }

            .index_page_header_search_tags_wrapper {
                align-items: center;
                display: flex;
                justify-content: center;
                margin-top: 20px;
                margin-bottom: 0px;
                max-width: 740px;

                .index_page_header_search_tag_pre {
                    color: var(--WR_BC5, #858c96);
                    flex-shrink: 0;
                    font-size: 15px;
                    line-height: 20px;
                    margin-right: 18px;
                }

                .index_page_header_search_tag {
                    border-radius: 18px;
                    box-sizing: border-box;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 20px;
                    margin-right: 12px;
                    max-width: 176px;
                    overflow: hidden;
                    padding: 6px 14px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                    word-wrap: normal;
                    background: var(--WR_BC42, rgba(13, 20, 30, .04));
                    color: var(--WR_BC4, #5d646e);
                }
            }
        }
    }

    // 加载按钮
    .load_snipper {
        width: 100%;
        text-align: center;
        margin-top: -20px;
        height: 30px;
        line-height: 30px;
    }

    .search_content_wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        /* 水平居中 */
        align-items: center;
        margin: -5px 0 0 0;
        padding: 0;

        .search_content_card_wrapper {
            background: #fff;
            border-radius: 12px;
            padding-bottom: 6px;
            max-width: 740px;
            width: 100%;
            margin-top: 0px auto;

            .search_content_card_header {
                align-items: center;
                color: var(--WR_BC4, #5d646e);
                display: flex;
                font-size: 15px;
                font-weight: 500;
                justify-content: space-between;
                line-height: 22px;

                .search_content_card_header_title {
                    padding: 20px 20px 6px;
                }

                .search_content_card_header_extra[data-v-a19acb88] {
                    margin-left: auto;
                }
            }

            .search_content_card_content {
                .search_content_card_content_item {
                    contain-intrinsic-size: 131px;
                    content-visibility: auto;
                    cursor: pointer;

                    .index_page_mini_bookInfo {
                        padding: 14px 20px;
                        display: flex;

                        .index_page_mini_bookInfo_cover_wrapper {
                            .index_page_mini_bookInfo_cover_pic {
                                height: 103px !important;
                                width: 72px !important;

                                .bookCover img,
                                .bookCover_img {
                                    background-color: #d8d8d8;
                                    height: 100%;
                                    -o-object-fit: cover;
                                    object-fit: cover;
                                    vertical-align: top;
                                    width: 100%;
                                }

                                .bookCover_decor .bookCover_gradientDecor {
                                    background-image: linear-gradient(90deg, rgba(161, 161, 161, .25), rgba(21, 21, 20, .1) 1%, rgba(255, 255, 255, .15) 4%, rgba(148, 148, 148, .1) 8%, rgba(227, 227, 227, 0) 57%, rgba(222, 217, 217, .03) 91%, rgba(222, 217, 217, .05) 98%, rgba(255, 255, 255, .1));
                                    box-shadow: inset 0 0 rgba(0, 0, 0, .1);
                                }
                            }
                        }

                        .index_page_mini_bookInfo_content_wrapper {
                            align-items: start;
                            color: var(--WR_BC3, #212832);
                            display: flex;
                            flex: 1;
                            font-size: 16px;
                            font-weight: 500;
                            line-height: 22px;
                            margin-left: 16px;

                            .index_page_mini_bookInfo_content_info {
                                display: flex;
                                flex: 1;
                                justify-content: space-between;

                                .index_page_mini_bookInfo_content_info_meta {
                                    flex: 1;

                                    .index_page_mini_bookInfo_content_title {
                                        align-items: center;
                                        display: flex;
                                        justify-content: space-between;
                                        width: 100%;
                                    }

                                    .index_page_mini_bookInfo_content_author {
                                        color: var(--WR_BC5, #858c96);
                                        font-size: 14px;
                                        font-weight: 400;
                                        line-height: 20px;
                                        width: -moz-fit-content;
                                        width: fit-content;
                                    }

                                    .index_page_mini_bookInfo_content_recommend {
                                        align-items: center;
                                        color: var(--WR_BC17, #99a0aa);
                                        display: flex;
                                        font-family: DIN, -apple-system, SF UI Text, PingFang SC, Lucida Grande, STheiti, Microsoft YaHei, sans-serif;
                                        font-size: 12px;
                                        font-weight: 400;
                                        line-height: 18px;

                                        .index_page_mini_bookInfo_content_recommend_lang {
                                            align-items: center;
                                            display: flex;
                                            font-size: 13px;
                                            justify-content: center;
                                            line-height: 18px;

                                            .index_page_mini_bookInfo_content_recommend_badge {
                                                margin-left: 3px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 主体内容
    .index_page_content_wrapper {
        margin: 0px auto 0 auto;
        padding: 0px;
        max-width: 1100px;

        .index_page_top_section_wrapper {
            .index_page_top_section_header_wrapper {
                align-items: center;
                display: flex;
                height: 60px;
                justify-content: space-between;
                padding: 0 20px;

                .index_page_top_section_header_title {
                    align-items: center;
                    color: var(--WR_BC3, #212832);
                    display: flex;
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 28px;

                    .index_page_top_section_content_title_action,
                    .index_page_top_section_header_title_action_lang {
                        align-items: center;
                        color: var(--WR_BC4, #5d646e);
                        cursor: pointer;
                        display: flex;
                        font-size: 15px;
                        font-weight: 400;
                        line-height: 21px;
                        margin-left: 12px;
                    }
                }

                .index_page_top_section_header_action {
                    align-items: center;
                    display: flex;

                    .index_page_top_section_header_action_link {
                        color: var(--WR_BC0, #1b88ee);
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 22px;
                    }

                    .index_page_top_section_header_action_link_sep {
                        background: var(--WR_BC6, #adb4be);
                        height: 16px;
                        margin: auto 16px;
                        width: 1px;
                    }
                }

                .index_page_top_section_header_title_action_arrow {
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADJSURBVHgBbY8xEoIwEEV3cbD2CFzBG8gNpHAoNZVDpZ5AOAF2DFoESgdn4AZ6FI9ArZI1iZJB8BfJZvP35Qfgq2N+2XBeTqAnSy0pL7ZE4vDEJv5rEPCq5FYTiNUpL/ZdA7ZFwouZhXTVA4RuwBY3Q1BSDUEU6SZSmfDS+SF0SJk0LGV5H5M9tfqGESINQrZSAVVQNS2ocRnzavNEys9zQCz1gchbM78yBB0IMf78gKL20hgseCisI3FZwPxwkEFOhIKA2WTvoKc3bm9QNiZCw+EAAAAASUVORK5CYII=) no-repeat;
                    background-size: 100%;
                    cursor: pointer;
                    height: 12px;
                    margin-left: 6px;
                    width: 8px
                }
            }

            .index_page_top_section_content_wrapper {
                .index_page_top_section_content {
                    .index_page_top_section_content_suggestions {
                        display: flex;
                        flex-wrap: wrap;
                        /* 允许子项换行 */
                        padding: 0;
                        margin: 0 0 0 10px;
                        justify-content: flex-start;
                        /* 确保子项从容器边缘开始排列 */

                        /* 响应式调整 */
                        @media (max-width: 800px) {
                            .suggestion_card_wrapper {
                                flex: 0 0 calc(33.333% - 20px);
                                /* 当屏幕宽度小于1000px时，调整为3个元素一行 */
                            }
                        }

                        @media (max-width: 600px) {
                            .suggestion_card_wrapper {
                                flex: 0 0 calc(50% - 20px);
                                /* 当屏幕宽度小于600px时，调整为2个元素一行 */
                            }
                        }

                        @media (max-width: 400px) {
                            .suggestion_card_wrapper {
                                flex: 0 0 calc(100% - 20px);
                                /* 当屏幕宽度小于400px时，调整为1个元素一行 */
                            }
                        }

                        .suggestion_card_wrapper {
                            background: var(--WR_BC31, #fff);
                            border-radius: 12px;
                            box-sizing: border-box;
                            cursor: pointer;
                            height: 320px;
                            padding: 20px 10px;
                            transition: transform .3s;
                            // width: 282px;
                            flex: 0 0 calc(25% - 20px);
                            /* 基础宽度为容器的25%，减去两边间隔 */
                            margin: 0 20px 20px 0;
                            /* 间隔 */

                            .suggestion_card_content {
                                align-items: center;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                margin-top: 32px;

                                .suggestion_card_cover {
                                    height: 139px;
                                    width: 96px;
                                }

                                .bookCover {
                                    background: #d8d8d8;
                                    box-shadow: 0 0 22px rgba(0, 0, 0, .05);
                                    display: block;
                                    position: relative;
                                }

                                .bookCover img,
                                .bookCover_img {
                                    background-color: #d8d8d8;
                                    height: 100%;
                                    -o-object-fit: cover;
                                    object-fit: cover;
                                    vertical-align: top;
                                    width: 100%;
                                }
                            }

                            .suggestion_card_content_info {
                                margin-top: 32px;

                                .suggestion_card_content_title {
                                    color: var(--WR_BC3, #212832);
                                    display: -webkit-box;
                                    display: -moz-box;
                                    font-size: 18px;
                                    font-weight: 500;
                                    height: 22px;
                                    line-height: 26px;
                                    line-height: 22px;
                                    overflow: hidden;
                                    text-align: center;
                                    text-overflow: ellipsis;
                                    -webkit-line-clamp: 1;
                                    -moz-line-clamp: 1;
                                    line-clamp: 1;
                                    -webkit-box-orient: vertical;
                                    -webkit-text-size-adjust: none;
                                    box-orient: vertical;
                                    height: auto;
                                    max-height: 22px;
                                }

                                .suggestion_card_content_author {
                                    color: var(--WR_BC16, #717882);
                                    display: -webkit-box;
                                    display: -moz-box;
                                    font-size: 14px;
                                    height: 14px;
                                    line-height: 20px;
                                    line-height: 14px;
                                    margin-top: 12px;
                                    overflow: hidden;
                                    text-align: center;
                                    text-overflow: ellipsis;
                                    -webkit-line-clamp: 1;
                                    -moz-line-clamp: 1;
                                    line-clamp: 1;
                                    -webkit-box-orient: vertical;
                                    -webkit-text-size-adjust: none;
                                    box-orient: vertical;
                                    height: auto;
                                    max-height: 14px;
                                }

                                .suggestion_card_content_reason {
                                    color: var(--WR_BC17, #99a0aa);
                                    display: -webkit-box;
                                    display: -moz-box;
                                    font-size: 13px;
                                    font-weight: 400;
                                    height: 44px;
                                    line-height: 22px;
                                    margin-top: 12px;
                                    overflow: hidden;
                                    text-align: center;
                                    text-overflow: ellipsis;
                                    -webkit-line-clamp: 2;
                                    -moz-line-clamp: 2;
                                    line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    -webkit-text-size-adjust: none;
                                    box-orient: vertical;
                                    height: auto;
                                    max-height: 44px;
                                }
                            }

                            .bookCover_decor {
                                top: 0;
                                right: 0;
                                bottom: 0;
                                left: 0;
                                position: absolute;
                            }

                            .bookCover_decor .bookCover_gradientDecor {
                                background-image: linear-gradient(90deg, rgba(161, 161, 161, .25), rgba(21, 21, 20, .1) 1%, rgba(255, 255, 255, .15) 4%, rgba(148, 148, 148, .1) 8%, rgba(227, 227, 227, 0) 57%, rgba(222, 217, 217, .03) 91%, rgba(222, 217, 217, .05) 98%, rgba(255, 255, 255, .1));
                                box-shadow: inset 0 0 rgba(0, 0, 0, .1);
                            }

                            .suggestion_card_content .suggestion_card_cover[data-v-a0b46522] {
                                height: 139px;
                                width: 96px;
                            }
                        }

                        .suggestion_card_wrapper:hover {
                            transform: scale(1.05);
                        }
                    }
                }
            }
        }
    }

}
</style>