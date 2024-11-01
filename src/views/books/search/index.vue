<template>
  <div class="app-container">
    <!--检索条件区-->
    <div class="search_erea_condition">
      <el-row>
        <el-input placeholder="input keywords..." @keyup.enter.native="handleSearch" clearable v-model="search.key"
          class="input-with-select">
          <el-select v-model="search.type" slot="prepend" placeholder="Retrieval type">
            <el-option label="by author" value="1"></el-option>
            <el-option label="by title" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
        </el-input>
      </el-row>
    </div>
    <div class="book_list_container">
      <div class="title_with_bottom">
        <svg-icon icon-class="list" /> Book List
      </div>
      <el-table :default-sort="{ prop: 'title', order: 'descending' }" :data="bookList"
        style="width: 100%;margin-top: 15px;font-size: 14px;" @row-click="handleRowClick">
        <el-table-column prop="title" :show-overflow-tooltip="true" label="Title" sortable>
        </el-table-column>
        <el-table-column prop="category" :show-overflow-tooltip="true" sortable label="Category" width="180"
          :formatter="categoryFormat">
        </el-table-column>
        <el-table-column prop="publishTime" sortable label="publishTime" width="180" :formatter="yearFormat">
        </el-table-column>
        <el-table-column prop="publisher" :show-overflow-tooltip="true" sortable label="publiser" width="200">
        </el-table-column>
        <el-table-column prop="author" :show-overflow-tooltip="true" sortable label="Author" width="200">
        </el-table-column>
      </el-table>
    </div>
    <div class="navi_container">
      <el-pagination background style="margin-top: 15px; text-align: center;" @current-change="handleCurrentChange"
        :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next" :total="search.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllBooks, getBookCategoryDict } from '@/api/system/job'
import { Loading } from 'element-ui'

export default {
  name: 'Dashboard',
  components: {
  },
  data() {
    return {
      bookList: [],
      recommendBooks: [],
      bookDetailVisiable: false,
      listLoading: false,
      search: {
        page: 0,
        total: 0,
        size: 10,
        key: null,
        type: null
      },
      bookCategoryDict: [],
      globalLoading: null
    }
  },
  created() {
    this.initBooks()
    this.initBookCategory()
  },
  methods: {
    initBookCategory() {
      getBookCategoryDict({ dictName: 'book_category' }).then(res => {
        this.bookCategoryDict = res
      })
    },
    initBooks() {
      this.showLoading()
      getAllBooks(this.search).then(res => {
        this.search.total = res.totalElements
        this.bookList = res.content
      }).finally(() => {
        this.closeLoading()
      })
    },
    handleSearch() {
      if (this.search.type) {
        this.initBooks()
      } else {
        this.$notify({
          title: 'Warning',
          message: 'The retrieval type is a required option',
          type: 'warning',
          duration: 2000
        })
      }
    },
    handleCurrentChange() {
      this.initBooks()
    },
    handleRowClick(row, col, value) {
      this.$router.push('/book/detail/' + row.id);
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
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 150px;
  height: 40px;
  line-height: 40px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
  height: 40px;
  line-height: 40px;
}

.input-with-select .el-input__inner {
  font-size: 15px;
  height: 42px;
  line-height: 42px;
}

.book_list_container {
  margin-top: 10px;
  padding: 10px;
}

.book_detail_container {
  display: flex;
  /* 启用Flexbox */
  align-items: flex-start;
  /* 子项在交叉轴上的对齐方式，这里是顶部对齐 */
}

.book_detail_image-container {
  flex: 0 0 200px;
  /* 不增长、不缩小，基础宽度为200px */
  margin-right: 20px;
  /* 右侧外边距，与描述信息分隔 */
}

.book_detail_image-container img {
  width: 100%;
  /* 图片宽度填充容器 */
  height: auto;
  /* 图片高度自适应 */
}

.description-container p {
  margin: 0 0 10px;
  /* 段落之间的间距 */
}





.navi_container {
  height: 100px;
  position: fixed;
  bottom: 0px;
  padding: 0 !important;
}

.title_with_bottom {
  /* padding-left: 10px; */
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 3px solid #007BFF;
}

.book_list {
  border: 1px solid #007BFF;
  padding: 0;
  margin: 0;
}

.book_list_item_ul {
  list-style-type: none;
  padding: 0;
  margin: 0px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.search_erea_condition {
  text-align: left;
  width: 70%;
  margin: 10px;

  .search_row {
    border-bottom: 1px solid rgb(217, 213, 213);
    margin-top: 30px;

    .title_with_icon {
      width: 110px;
      height: 50px;
      padding: 0px;
      display: grid;
      grid-template-columns: auto 1fr;
      /* 图标自适应宽度，文字占据剩余空间 */
      align-items: center;
      /* 垂直居中 */

      .title_font {
        // font-weight: bold;
        font-size: 18px;
        text-align: left;
        margin-left: 8px;
      }
    }

    .condition_list {
      min-height: 50px;
      line-height: 50px;
      padding: 0px;
      // margin: 0px 30px 0 50px;

      .alphabet_link {
        list-style-type: none;
        padding: 0;
        margin: 0px;
      }
    }
  }
}

.book_list {
  margin-left: 50px;
  margin-right: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
