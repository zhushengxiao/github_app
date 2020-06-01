/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../../store/action';

import NavigationUtil from '../../navigator/NavigationUtil';

class TrendingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> welcome to TrendingPage </Text>
        <Button
          title="改变主题颜色1"
          onPress={() => {
            this.props.onThemeChange('yellow');
          }}
        />
        <Button
          title="改变主题颜色2"
          onPress={() => {
            this.props.onThemeChange('orange');
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  //创建一个函数,把theme传递过去
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage);

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
});
