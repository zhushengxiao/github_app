/* eslint-disable prettier/prettier */
// import {
//   onRefreshPopularData,
//   onLoadMorePopularData,
//   onFlushPopularFavorite,
// } from './popular/index';

// export default {
//   onRefreshPopularData,
//   onLoadMorePopularData,
//   onFlushPopularFavorite,
// };

//创建根action(不是必须)
import {onThemeChange} from './theme';
import {onLoadPopularData} from './popular';

export default {
  onThemeChange,
  onLoadPopularData,
};
