/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import NavigationUtil from '../navigator/NavigationUtil';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      const {navigation} = this.props;
      NavigationUtil.resetToHomPage({navigation});
    }, 2000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> welcome to welcomePage </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);

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
