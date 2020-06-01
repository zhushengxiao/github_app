/* eslint-disable prettier/prettier */
import Types from '../../action/types';

const defaultState = {
  theme: 'blue',
};

export default function onAction(state = defaultState, action) {
  console.log('theme', action.theme);
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme, //定义一个theme参数
      };
    default:
      return state;
  }
}
