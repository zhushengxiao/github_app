/* eslint-disable prettier/prettier */
import Types from '../types';
import {_projectModels, doCallBack, handleData} from '../ActionUtil';
import ArrayUtil from '../../../utils/ArrayUtil';
import Utils from '../../../utils/Utils';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = []; //保存token的数组,token是搜索唯一标识符

/**
 * 发起搜索
 * @param inputKey 搜索key
 * @param pageSize  每页显示多少条数据
 * @param token 与该搜索关联的唯一token
 * @param favoriteDao   收藏
 * @param popularKeys   topNavbar数据
 * @param callBack
 * @returns {function(*=)}
 */
export function onSearch(
  inputKey,
  pageSize,
  token,
  favoriteDao,
  popularKeys,
  callBack
) {
  return (dispatch) => {
    dispatch({type: Types.SEARCH_REFRESH});
    fetch(genFetchUrl(inputKey))
      .then((response) => {
        return hasCancel(token) ? null : response.json();
      })
      .then((responseData) => {
        if (hasCancel(token, true)) {
          //如果取消搜索，将token从数组中移除
          console.log('cancel search');
          return;
        }
        if (
          !responseData ||
          !responseData.items ||
          responseData.items.length === 0
        ) {
          dispatch({
            type: Types.SEARCH_FAIL,
            message: `没找到关于${inputKey}的项目`,
          });
          doCallBack(callBack, `没找到关于${inputKey}的项目`);
          return;
        }
        let items = responseData.items;
        handleData(
          Types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          '',
          {data: items},
          pageSize,
          favoriteDao,
          {
            showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey), //搜索的key是否在最热模块的topNavbar数据中
            inputKey,
          }
        );
      })
      .catch((e) => {
        console.log(e);
        dispatch({type: Types.SEARCH_FAIL, error: e});
      });
  };
}

/**
 * 取消一个异步任务
 * @param token
 * @returns {function(*)}
 */
export function onSearchCancel(token) {
  return (dispatch) => {
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  };
}

/**
 * 加载更多
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao   搜藏
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMoreSearch(
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack
) {
  return (dispatch) => {
    setTimeout(() => {
      //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex,
        });
      } else {
        //本次和载入的最大数量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}

/**
 * 检查指定token是否已经取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}
