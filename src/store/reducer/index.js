/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';
import {
  rootComponent,
  AppNavigator,
  navReducer,
} from '../../navigator/AppNavigator';

import theme from './theme';
import popular from './popular';
import trending from './trending';

// //1.指定默认state
// const navState = RootNavigator.router.getStateForAction(
//   RootNavigator.router.getActionForPathAndParams(rootCom),
// );

// /**
//  * 2.创建自己的 navigation reducer，
//  */
// const navReducer = (state = navState, action) => {
//   const nextState = RootNavigator.router.getStateForAction(action, state);
//   // 如果`nextState`为null或未定义，只需返回原始`state`
//   return nextState || state;
// };

const index = combineReducers({
  nav: navReducer,
  theme: theme,
  popular: popular,
  trending: trending,
});

export default index;
