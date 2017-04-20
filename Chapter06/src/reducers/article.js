import mapHelpers from '../utils/mapHelpers';

const article = (state = {}, action) => {
  switch (action.type) {
    case 'ARTICLES_LIST_ADD':
      let articlesList = action.payload.response;
      return mapHelpers.addMultipleItems(state, articlesList);
    case 'PUSH_NEW_ARTICLE':
      let newArticleObject = action.payload.response;
      return mapHelpers.addItem(state, newArticleObject['_id'], newArticleObject);
    case 'EDIT_ARTICLE':
      let editedArticleObject = action.payload.response;
      return mapHelpers.addItem(state, editedArticleObject['_id'], editedArticleObject);
    case 'DELETE_ARTICLE':
      let deleteArticleId = action.payload.response;
      return mapHelpers.deleteItem(state, deleteArticleId);
    default:
      return state;
  }
}

export default article