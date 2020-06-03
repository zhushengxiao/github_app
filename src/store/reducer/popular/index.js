/* eslint-disable prettier/prettier */
import Types from '../../action/types';

const defaultState = {};

/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store(难点：store key不固定)；
 * @param state
 * @param action
 * @returns {{theme: (onAction|*|string)}}
 */

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH: //下拉刷新
      return {
        ...state, //原来的state
        [action.storeName]: {
          ...[action.storeName],
          isLoading: true, //开始刷新,loading为true
          hideLoadingMore: true, //隐藏上拉加载更多
        },
      };
    case Types.POPOLAR_REFRESH_SUCCESS: //下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items, //数据
          projectModels: action.projectModels, //此次要显示的数据
          isLoading: false, //刷新成功后返回false
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.POPOLAR_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          isLoading: false,
        },
      };
    case Types.POPOLAR_LOAD_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
          projectModels: action.projectModels,
        },
      };
    case Types.POPOLAR_LOAD_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };
    case Types.FLUSH_POPULAR_FAVORITE: //刷新收藏状态
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
        },
      };
    default:
      return state;
  }
}
