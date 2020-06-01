/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtil from '../navigator/NavigationUtil';
import TabNavigater from '../navigator/TabNavigator';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 处理 Android 中的物理返回键
   * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
   * @returns {boolean}
   */

  onBackPress = () => {
    const {nav} = this.props;
    const {dispatch} = this.props.navigation;
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    NavigationUtil.navigation = this.props.navigation;
    return <TabNavigater />;
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

// export default HomePage;
