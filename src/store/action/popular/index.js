/* eslint-disable prettier/prettier */
import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../../Dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

export function onLoadPopularData(storeName, url, pageSize, favoriteDao) {
  return (dispatch) => {
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});

    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_popular)
      .then((data) => {
        // handleData(dispatch, storeName, data);
        handleData(
          Types.POPOLAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao
        );
      })
      .catch((error) => {
        dispatch({
          type: Types.POPOLAR_REFRESH_FAIL,
          storeName, //es7语法,相当于storeName:storeName
          error,
        });
      });
  };
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @param favoriteDao
 * @returns {function(*)}
 */

export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack
) {
  return (dispatch) => {
    // console.log('pageIndex', pageIndex);
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more popular data');
        }
        console.log('enter the fail moredata');
        dispatch({
          type: Types.POPOLAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
        });
      } else {
        //本次和载入的最大数量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        // console.log(pageIndex, max);
        _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
          dispatch({
            type: Types.POPOLAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}

/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onFlushPopularFavorite(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao
) {
  return (dispatch) => {
    //本次和载入的最大数量
    let max =
      pageSize * pageIndex > dataArray.length
        ? dataArray.length
        : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
      dispatch({
        type: Types.FLUSH_POPULAR_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data,
      });
    });
  };
}
