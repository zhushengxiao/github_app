/* eslint-disable prettier/prettier */
import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from '../../../response/styles/ThemeFactory';

const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  onShowCustomThemeView: false,
};

export default function onAction(state = defaultState, action) {
  console.log(action.type, action.customThemeViewVisible);
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme, //定义一个theme参数
      };
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      };
    default:
      return state;
  }
}
