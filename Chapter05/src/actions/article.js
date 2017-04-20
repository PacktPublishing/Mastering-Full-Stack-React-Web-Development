export default {
  articlesList: (response) => {
    return {
      type: 'ARTICLES_LIST_ADD',
      payload: { response: response }
    }
  },
  pushNewArticle: (response) => {
    return {
      type: 'PUSH_NEW_ARTICLE',
      payload: { response: response }
    }
  },
  editArticle: (response) => {
    return {
      type: 'EDIT_ARTICLE',
      payload: { response: response }
    }
  },
  deleteArticle: (response) => {
    return {
      type: 'DELETE_ARTICLE',
      payload: { response: response }
    }
  }
}