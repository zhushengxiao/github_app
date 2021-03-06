/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../store/action/index';
import {NavigationActions} from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtil from '../navigator/NavigationUtil';
import TabNavigater from '../navigator/TabNavigator';
import CustomTheme from '../pages/CustomTheme/CustomTheme';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

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

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    );
  }

  render() {
    const {theme} = this.props;
    NavigationUtil.navigation = this.props.navigation;
    return (
      <SafeAreaViewPlus topColor={theme.themeColor}>
        <TabNavigater />
        {this.renderCustomThemeView()}
      </SafeAreaViewPlus>
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
  theme: state.theme.theme,
});
const mapDispatchToProps = (dispatch) => ({
  onShowCustomThemeView: (show) =>
    dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

// export default HomePage;
