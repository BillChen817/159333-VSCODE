import request from '@/utils/request'

export function getAllJob() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: 'api/job',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/job',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/job',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/job',
    method: 'put',
    data
  })
}

export function getAllBooks(params) {
  return request({
    url: 'api/books/list',
    method: 'get',
    params
  })
}

export function createBook(data) {
  return request({
    url: 'api/books/create',
    method: 'post',
    data: data
  })
}

export function deleteBook(params) {
  return request({
    url: 'api/books/delete',
    method: 'get',
    params
  })
}

export function getBookContents(params) {
  return request({
    url: 'api/books/list/contents',
    method: 'get',
    params
  })
}

export function addBookContents(data) {
  return request({
    url: 'api/books/add/contents',
    method: 'post',
    data: data
  })
}


export function queryBook(params) {
  return request({
    url: 'api/books/query',
    method: 'get',
    params
  })
}

export function borrowBook(params) {
  return request({
    url: 'api/books/borrow',
    method: 'get',
    params
  })
}

export function listBorrowHistory(params) {
  return request({
    url: 'api/books/borrow/history',
    method: 'get',
    params
  })
}

export function hasDueRecord(params) {
  return request({
    url: 'api/books/borrow/hasDueRecord',
    method: 'get',
    params
  })
}

export function returnBook(params) {
  return request({
    url: 'api/books/return',
    method: 'get',
    params
  })
}

export function updateBookContents(data) {
  return request({
    url: 'api/books/update/contents',
    method: 'post',
    data: data
  })
}

export function deleteBookContents(params) {
  return request({
    url: 'api/books/delete/contents',
    method: 'get',
    params
  })
}

export function getBookCategoryDict(params) {
  return request({
    url: 'api/dictDetail/query',
    method: 'get',
    params
  })
}

export function getBookDetail(params) {
  return request({
    url: 'api/books/detail',
    method: 'get',
    params
  })
}

export function addBookComment(data) {
  return request({
    url: 'api/books/add/comment',
    method: 'post',
    data: data
  })
}

export function addToBookShelf(data) {
  return request({
    url: 'api/books/collect',
    method: 'post',
    data: data
  })
}

export function listBookShelf(data) {
  return request({
    url: 'api/books/collect/list',
    method: 'post',
    data: data
  })
}

export function listAuthors(params) {
  return request({
    url: 'api/books/collect/authors',
    method: 'get',
    params
  })
}

export function listCategories(params) {
  return request({
    url: 'api/books/collect/categories',
    method: 'get',
    params
  })
}

export function listFavorite(params) {
  return request({
    url: 'api/users/favorite/list',
    method: 'get',
    params
  })
}

export function addFavorite(params) {
  return request({
    url: 'api/users/favorite/add',
    method: 'get',
    params
  })
}

export function removeFavorite(params) {
  return request({
    url: 'api/users/favorite/remove',
    method: 'get',
    params
  })
}

export function listRecommend(params) {
  return request({
    url: 'api/users/recommend/list',
    method: 'get',
    params
  })
}

export function refreshRecommend(params) {
  return request({
    url: 'api/users/recommend/refresh',
    method: 'get',
    params
  })
}

export function generateRecommend(params) {
  return request({
    url: 'api/users/recommend/generate',
    method: 'get',
    params
  })
}

export default { add, edit, del }
