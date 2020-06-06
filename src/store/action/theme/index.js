/* eslint-disable prettier/prettier */
import Types from '../types';
import ThemeDao from '../../../Dao/ThemeDao';

/**
 * 改变主题
 * @param {*} theme
 */

export function onThemeChange(theme) {
  return {type: Types.THEME_CHANGE, theme: theme}; //返回一个action和要传递的数据
}

/**
 * 初始化主题
 * @returns {Function}
 */
export function onThemeInit() {
  return (dispatch) => {
    new ThemeDao().getTheme().then((data) => {
      dispatch(onThemeChange(data));
    });
  };
}

/**
 * 显示自定义主题view
 * @param show
 * @returns {{type: *, customThemeViewVisible: *}}
 */
export function onShowCustomThemeView(show) {
  return {type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show};
}
