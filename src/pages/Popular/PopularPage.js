/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../../common/NavigationBar';
import EventBus from 'react-native-event-bus';
import EventTypes from '../../utils/EventTypes';

import NavigationUtil from '../../navigator/NavigationUtil';
import FavoriteUtil from '../../utils/FavoriteUtil';

import FavoriteDao from '../../Dao/FavoriteDao';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
import {FLAG_STORAGE} from '../../Dao/DataStore';

import actions from '../../store/action/index';

import PopularItem from '../../common/PopularItem';
import {FLAG_LANGUAGE} from '../../Dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

const THEME_COLOR = '#678';

type Props = {};
class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['java', 'ios', 'php', 'python', 'swift'];
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key); //请求topNavBar数据
  }

  //生成topTab
  _genTabs() {
    const tabs = {};
    const {keys} = this.props; //topNavBar数据

    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: (props) => <PopularTabPage {...props} tabLabel={item.name} />, //定义tab时给页面传递参数
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }

  render() {
    const {keys} = this.props; //topNavBar数据
    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };

    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );

    //上方tab
    const TabNavigator = keys.length
      ? createAppContainer(
          createMaterialTopTabNavigator(this._genTabs(), {
            tabBarOptions: {
              tabStyle: styles.tabStyle, //给topTab设置样式
              upperCaseLabel: false, //默认文字大写
              scrollEnabled: true, //可滚动
              style: {
                backgroundColor: '#95de64',
                height: 50, //开启scrollEnabled后再Android上初次加载时闪烁问题,给个固定高度
              },
              indicatorStyle: styles.indStyle, //指示器样式,就是tab下面那个横线
              labelStyle: styles.labelStyle, //tab上的文字属性
            },
            lazy: true,
          })
        )
      : null;
    return (
      <View style={{flex: 1}}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
      </View>
    );
  }
}

const mapPopularStateToProps = (state) => ({
  keys: state.language.keys, //topNavBar数据
});
const mapPopularDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps
)(PopularPage);

const currentPageSize = 10;
//每一个topTab的具体页面
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false; //是否有收藏状态的改变
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventTypes.favorite_changed_popular,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true; //从收藏页面传来通知,在收藏页面改变了最热模块的收藏状态
      })
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = (data) => {
        if (data.to === 0 && this.isFavoriteChanged) {
          //点击了第0个bottomtabbar,并且有收藏状态改变
          this.loadData(null, true);
        }
      })
    );
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const {
      onLoadPopularData,
      onLoadMorePopular,
      onFlushPopularFavorite,
    } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        currentPageSize,
        store.items,
        favoriteDao,
        (callback) => {
          this.refs.toast.show('没有更多数据了');
        }
      );
    } else if (refreshFavorite) {
      onFlushPopularFavorite(
        this.storeName,
        store.pageIndex,
        currentPageSize,
        store.items,
        favoriteDao
      );
      this.isFavoriteChanged = false;
    } else {
      //   console.log('loaddata');
      onLoadPopularData(this.storeName, url, currentPageSize, favoriteDao);
    }
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    // console.log('dataItem================>', data);
    return (
      <PopularItem
        projectModel={item}
        onSelect={(callBack) => {
          NavigationUtil.goPage(
            {
              flag: FLAG_STORAGE.flag_popular,
              projectModel: item,
              callBack,
            },
            'DetailsPage'
          );
        }}
        onFavorite={(item, isFavorite) => {
          return FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular
          );
        }}
      />
    );
  }

  genIndicator() {
    //是否显示加载更多的菊花

    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */

  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName]; //动态获取state

    if (!store) {
      //在state树中没有默认的state,所以初始化一个默认的state树
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }

  render() {
    let store = this._store();
    // console.log('store================>', store);
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={'red'}
              colors={['red']}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={'red'}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast
          ref={'toast'} //添加toast
          position={'center'}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  popular: state.popular, //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = (dispatch) => ({
  onLoadPopularData: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
    callBack
  ) =>
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack
      )
    ),
  onFlushPopularFavorite: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao
  ) =>
    dispatch(
      actions.onFlushPopularFavorite(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao
      )
    ),
});
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a0d911',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabStyle: {
    minWidth: 60,
  },
  indStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
