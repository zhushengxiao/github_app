/* eslint-disable prettier/prettier */
import React, {Component} from 'react';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import PopularPage from '../pages/Popular/PopularPage';
import TrendingPage from '../pages/Trending/TrendingPage';
import FavoritePage from '../pages/Favorite/FavoritePage';
import MyPage from '../pages/My/MyPage';
import NavigationUtil from '../navigator/NavigationUtil';

import EventBus from 'react-native-event-bus';
import EventTypes from '../utils/EventTypes';

import {connect} from 'react-redux';

const BottomTabbarNavigator = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons name={'whatshot'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons name={'favorite'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo name={'user'} size={20} style={{color: tintColor}} />
      ),
    },
  },
};

class TabNavigator extends Component {
  constructor(props) {
    super(props);
  }
  _tabNavigator() {
    if (this.bottomTabbars) {
      return this.bottomTabbars;
    }

    const {
      PopularPage,
      TrendingPage,
      FavoritePage,
      MyPage,
    } = BottomTabbarNavigator;
    // PopularPage.navigationOptions.tabBarLabel = '最新';
    const BottomTabs = {
      PopularPage,
      TrendingPage,
      FavoritePage,
      MyPage,
    };

    this.bottomTabbars = createAppContainer(
      createBottomTabNavigator(BottomTabs, {
        tabBarComponent: (props) => {
          return <TabBarComponent {...props} theme={this.props.theme} />;
        },
      })
    );

    return this.bottomTabbars;
  }
  render() {
    console.log('theme', this.props.theme);
    const BottonTabbarComponent = this._tabNavigator();

    return (
      <BottonTabbarComponent
        onNavigationStateChange={(prevState, newState, action) => {
          EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
            from: prevState.index,
            to: newState.index,
          });
        }}
      />
    );
  }
}

class TabBarComponent extends Component {
  constructor(props) {
    super(props);
    this.theme = {
      //定义一个主题属性
      tintColor: this.props.theme, //设置颜色
      updataTime: new Date().getTime(), //时间作为标志位
    };
  }

  render() {
    console.log('themeTab', this.props.theme);
    // const {routes, index} = this.props.navigation.state; //获取tabbar数组和相应的index
    // if (routes[index].params) {
    //   //如果当前tabbar有params
    //   const {theme} = routes[index].params; //获取theme属性
    //   if (theme && theme.updataTime > this.theme.updataTime) {
    //     //新来的时间大于之前theme时间
    //     this.theme = theme; //把新来的theme赋值给theme
    //   }
    // }

    return (
      <BottomTabBar //navigation组件tabbar
        {...this.props}
        //navigation传过来的参数
        // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
        //redux传过来的参数
        activeTintColor={this.theme.tintColor || this.activeTintColor}
        inactiveTintColor={this.props.theme}
      />
    );
  }
}

/**
 * state是reducer中的state
 * state.theme是reducer文件夹index.js文件combineReducers中的theme
 * state.theme.theme是reducer文件夹,下的theme文件夹下的index.js文件Types.THEME_CHANGE的自定义theme
 */
const mapStateToProps = (state) => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(TabNavigator);
