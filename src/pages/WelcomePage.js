/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import NavigationUtil from '../navigator/NavigationUtil';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class WelcomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      const {navigation} = this.props;
      //   SplashScreen.hide();
      NavigationUtil.resetToHomPage({navigation});
    }, 2000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Image
          style={{height: screenHeight, width: screenWidth}}
          source={require('../../assets/u=2786796087,2598859014&fm=214&gp=0.jpg')}
        />
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
