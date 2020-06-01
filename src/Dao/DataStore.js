/* eslint-disable prettier/prettier */
import {AsyncStorage} from 'react-native';
import Trending from 'GitHubTrending';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};

export default class DataStore {
  /**
   * 获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   * @param url
   * @param flag
   * @returns {Promise}
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then((wrapData) => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then((data) => {
                resolve(this._wrapData(data));
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          this.fetchNetData(url, flag)
            .then((data) => {
              resolve(this._wrapData(data));
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  }
  /**
   * 保存数据
   * @param url
   * @param data
   * @param callback
   */
  saveData(url, data, callback) {
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()};
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise}
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
            console.log('获取本地数据时成功，但解析时错误', error);
          }
        } else {
          reject(error);
          console.log('获取本地数据时出错', error);
        }
      });
    });
  }

  /**
   * 获取网络数据
   * @param url
   * @param flag
   * @returns {Promise}
   */

  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then((responseData) => {
            console.log('获取成功popular');
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        new Trending()
          .fetchTrending(url)
          .then((items) => {
            if (!items) {
              throw new Error('responseData is null');
            }
            console.log(items);
            this.saveData(url, items);
            resolve(items);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  /**
   * 检查timestamp是否在有效期内
   * @param timestamp 项目更新时间
   * @return {boolean} true 不需要更新,false需要更新
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    }
    //有效期4小时
    return true;
  }
}
