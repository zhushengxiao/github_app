/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  RefreshControl,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../../store/action';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';
import EventTypes from '../../utils/EventTypes';
import NavigationUtil from '../../navigator/NavigationUtil';

import PopularItem from '../../common/PopularItem';
import TrendingItem from '../../common/TrendingItem';
import NavigationBar from '../../common/NavigationBar';
import FavoriteDao from '../../Dao/FavoriteDao';
import {FLAG_STORAGE} from '../../Dao/DataStore';
import FavoriteUtil from '../../utils/FavoriteUtil';

const THEME_COLOR = '#ff4d4f';

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={'收藏'}
        statusBar={statusBar}
        style={{backgroundColor: '#f5222d'}}
      />
    );
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />
            ), //初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
            navigationOptions: {
              title: '最热',
            },
          },
          Trending: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />
            ), //初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
            navigationOptions: {
              title: '趋势',
            },
          },
        },
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //是否使标签大写，默认为true
            scrollEnabled: false, //不可滚动,topnavbar可平分屏幕宽度
            style: {
              backgroundColor: THEME_COLOR, //TabBar 的背景颜色
              height: 50, //fix 开启scrollEnabled后再Android上初次加载时闪烁问题
            },
            indicatorStyle: styles.indicatorStyle, //标签指示器的样式
            labelStyle: styles.labelStyle, //文字的样式
          },
        }
      )
    );
    return (
      <View style={{flex: 1}}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.listener = (data) => {
        if (data.to === 2) {
          //点击了第2个bottomtabbar
          this.loadData(false); //不显示菊花
        }
      })
    );
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        isLoading: false,
        projectModels: [], //要显示的数据
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(
      this.favoriteDao,
      item,
      isFavorite,
      this.props.flag
    );
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular); //发送通知,最热模块收藏状态有改变
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending); //发送通知,趋势模块收藏状态有改变
    }
  }

  renderItem(data) {
    const item = data.item;
    //使用PopularItem还是TrendingItem
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={(callBack) => {
          //   console.log('callback', callBack);
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_trending,
              callBack,
            },
            'DetailsPage'
          );
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  render() {
    let store = this._store();
    // console.log('store----->', store);
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={'red'}
              colors={['red']}
              tintColor={'red'}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
            />
          }
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  favorite: state.favorite,
});
const mapDispatchToProps = (dispatch) => ({
  onLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    color: 0xaa7777,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
