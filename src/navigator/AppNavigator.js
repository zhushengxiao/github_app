/* eslint-disable prettier/prettier */
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {connect} from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import HomePage from '../pages/HomePage';
import Welcomepage from '../pages/WelcomePage';
import DetailsPage from '../pages/Detail/DetailPage';

export const rootComponent = 'Init'; //设置根路由

const InitNavigator = createStackNavigator({
  Welcomepage: {
    screen: Welcomepage,
    navigationOptions: {
      header: null,
    },
  },
});

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    },
  },
  DetailsPage: {
    screen: DetailsPage,
    navigationOptions: {
      header: null,
    },
  },
});

export const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Init: InitNavigator,
      Main: MainNavigator,
    },
    {
      initialRouteName: 'Init',
    }
  )
);

/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为reduxifyNavigator的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 * 把需要导航的组件与导航reducer连接起来
 */

export const navReducer = createNavigationReducer(AppNavigator);

export const middleware = createReactNavigationReduxMiddleware(
  (state) => state.nav,
  'root'
);

/**
 * 2.将根导航器组件传递给 reduxifyNavigator 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 * 弃用方法
 */
// const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

/**
 *2 将NavigationStack封装成高阶组件AppNavigation，这个高阶组件完成了navigation prop的替换，
 * 改成了使用redux里的navigation
 */

export const App = createReduxContainer(AppNavigator);

const mapStateToProps = (state) => ({
  state: state.nav,
});

export default connect(mapStateToProps)(App);
