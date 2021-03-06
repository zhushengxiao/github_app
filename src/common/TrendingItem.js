/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import BaseItem from './BaseItem';
const {height, width} = Dimensions.get('window');

export default class TrendingItem extends BaseItem {
  render() {
    const {projectModel, theme} = this.props;
    console.log('tringItem--------->', theme);
    const {item} = projectModel;
    if (!item) {
      return null;
    }

    //搜藏按钮
    let favouriteButton = (
      <TouchableOpacity
        style={{padding: 6}} //padding:增加点击的范围
        onPress={() => {}}
        underlayColor={'transparent'} //按下颜色,透明
      >
        <FontAwesome name={'star-o'} size={26} style={{color: 'red'}} />
      </TouchableOpacity>
    );
    return (
      <TouchableOpacity
        //   onPress={this.props.onSelect}
        onPress={() => this.onItemClick()} //执行baseItem里面的方法s
        style={styles.box}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>
            {item.fullName ? item.fullName.split('"')[0] : null}
          </Text>
          <HTMLView
            value={item.description}
            onLinkPress={(url) => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built by: </Text>
              {item.contributors.map((result, i, arr) => {
                if (i % 2 === 0) {
                  return;
                }
                return (
                  <Image
                    key={i}
                    style={{height: 22, width: 22, margin: 2}}
                    source={{uri: arr[i]}}
                  />
                );
              })}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Start:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: '#d3adf7',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
    width: width,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
    fontWeight: 'bold',
    fontFamily: 'cuisive',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
});
