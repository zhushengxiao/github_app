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
import {onThemeChange, onThemeInit, onShowCustomThemeView} from './theme';
import {
  onLoadPopularData,
  onLoadMorePopular,
  onFlushPopularFavorite,
} from './popular';
import {
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';
import {onSearch, onLoadMoreSearch, onSearchCancel} from './search';

export default {
  onThemeChange,
  onLoadPopularData,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushTrendingFavorite,
  onLoadLanguage,
  onThemeInit,
  onShowCustomThemeView,
  onSearch,
  onLoadMoreSearch,
  onSearchCancel,
};
