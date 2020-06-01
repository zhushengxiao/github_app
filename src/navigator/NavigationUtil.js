/* eslint-disable prettier/prettier */
export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param params
   */
  static goPage(params, page) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation can not null of NavigationUtil ');
    }
    navigation.navigate(page, {...params});
  }

  /**
   * 返回上一页
   * @param navigation
   */
  static goBack(navigation) {
    navigation.goBack();
  }

  /**
   * 重置到首页
   * @param navigation
   */
  static resetToHomPage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
