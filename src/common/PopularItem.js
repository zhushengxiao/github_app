/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {projectModel} = this.props; //获取数据

    const item = projectModel;
    if (!item || !item.owner) {
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
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.full_name || item.fullName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.text}>{'Author:'}</Text>
              <Image
                style={{height: 22, width: 22}}
                source={{uri: item.owner.avatar_url || item.url}}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.text}>{'Start:'}</Text>
              <Text style={styles.text}>{item.stargazers_count}</Text>
            </View>
            {favouriteButton}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: '#bae637',
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
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#ff7875',
    fontWeight: 'bold',
    fontFamily: 'cuisive',
  },
  description: {
    fontFamily: 'tahoma',
    fontSize: 14,
    marginBottom: 2,
    color: '#5c0011',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  text: {
    color: '#5cdbd3',
  },
});
