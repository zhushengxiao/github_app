/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../../store/action';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrendingDialog, {TimeSpans} from '../../common/TrendingDialog';
import {FLAG_STORAGE} from '../../Dao/DataStore';

import TrendingItem from '../../common/TrendingItem';
import NavigationUtil from '../../navigator/NavigationUtil';

import FavoriteUtil from '../../utils/FavoriteUtil';

import FavoriteDao from '../../Dao/FavoriteDao';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

import NavigationBar from '../../common/NavigationBar';

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'; //事件名
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#a0d911';

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0], //默认选择今天
    };
    this.tabNames = ['JavaScript', 'C', 'vim', 'C++', 'go'];
  }

  _generateTopTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: (props) => (
          <TrendingTabPage
            {...props}
            timeSpan={this.state.timeSpan}
            tabLabel={item}
          />
        ),
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }

  //绘制navigationView,点击显示trendingDialog
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={() => this.dialog.show()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 18,
                color: '#FFFFFF',
                fontWeight: '400',
              }}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab,
    });
    //发送事件,为了topnavbar不刷新,topnavbar附属的页面就不会刷新,发送事件过去,让页面刷新
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }

  //生成trendingDialog
  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={(dialog) => (this.dialog = dialog)}
        onSelect={(tab) => this.onSelectTimeSpan(tab)}
      />
    ); //拿到trendingDialog赋给this.dialog
  }

  _tabNav() {
    if (!this.TabTopNavigator) {
      this.TabTopNavigator = createAppContainer(
        createMaterialTopTabNavigator(this._generateTopTabs(), {
          tabBarOptions: {
            tabStyle: styles.topTabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: '#678',
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        })
      );
    }
    return this.TabTopNavigator;
  }

  render() {
    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: '#2f54eb',
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );

    const TopNavigationComponent = this._tabNav();

    //上方tab

    return (
      <View style={{flex: 1}}>
        {navigationBar}
        <TopNavigationComponent />
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const currentPageSize = 10;
//每一个topTab的具体页面
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan; //trendingDialog的哪个item
  }

  componentDidMount() {
    this.loadData();
    //监听事件,当有事件来的时候会执行事件里面的方法
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(
      EVENT_TYPE_TIME_SPAN_CHANGE,
      (timeSpan) => {
        this.timeSpan = timeSpan;
        this.loadData();
      }
    );
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove(); //移除事件监听
    }
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        store.pageIndex + 1,
        currentPageSize,
        store.items,
        favoriteDao,
        (callback) => {
          this.refs.toast.show('没有更多数据了');
        }
      );
    } else {
      onRefreshTrending(this.storeName, url, currentPageSize, favoriteDao);
    }
  }

  genFetchUrl(key) {
    // console.log(' this.timeSpan.searchText--->', this.timeSpan.searchText);
    return URL + key + '?' + this.timeSpan.searchText;
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

  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        projectModel={item}
        onSelect={(callBack) => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_trending,
            },
            'DetailsPage'
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_trending
          )
        }
      />
    );
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName]; //动态获取state数据,把storeName传过去
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
    console.log('store--------------------->', store);
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
            //上拉完成的回调
            setTimeout(() => {
              //设置定时器,使标志位一定设置成功
              if (this.canLoadMore) {
                //上拉时会有两次回调,设置标志位使只加载一次数据
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5} //flatlist和上拉控件的距离
          onMomentumScrollBegin={() => {
            //上拉时的回调
            this.canLoadMore = true; //开始设置标志位
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
  trending: state.trending, //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = (dispatch) => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
    callBack
  ) =>
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack
      )
    ),
});
const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9254de',
  },
  welcome: {
    fontSize: 24,
    color: 0xaa7777,
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
