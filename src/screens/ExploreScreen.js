import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';
import { wp, hp, fs, sp } from '../utils/responsive';
import { 
  searchDestinations, 
  clearSearch, 
  addFavoriteDestination, 
  removeFavoriteDestination 
} from '../store/slices/destinationsSlice';

export default function ExploreScreen({ navigation }) {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = getThemeColors(isDark);

  // Get the full destinations state
  const destinationsState = useSelector(state => {
    console.log('Full destinations state:', state.destinations);
    return state.destinations;
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Safely extract state with defaults
  const allDestinations = destinationsState?.destinations || [];
  const searchResults = destinationsState?.searchResults || [];
  const favoriteDestinations = destinationsState?.favoriteDestinations || [];
  const loading = destinationsState?.loading || false;
  const search = destinationsState?.search || '';

  console.log('Extracted allDestinations:', allDestinations.length);

  // Show search results if actively searching, otherwise show all
  const displayDestinations = search && search.trim().length > 0 ? searchResults : allDestinations;

  useEffect(() => {
    console.log('ExploreScreen State:', { 
      allDestinationsCount: allDestinations.length, 
      searchResultsCount: searchResults.length,
      displayDestinationsCount: displayDestinations.length,
      search,
      loading 
    });
  }, [allDestinations, searchResults, displayDestinations, search, loading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim().length > 0) {
      dispatch(searchDestinations(text));
    } else {
      dispatch(clearSearch());
    }
  };

  const handleDestinationPress = (destination) => {
    navigation.navigate('Details', {
      item: {
        id: destination.id,
        name: destination.name,
        category: destination.category,
        distance: destination.distance,
        rating: destination.rating,
        image: destination.image,
      },
    });
  };

  const renderDestinationCard = ({ item }) => {
    const isFavorite = favoriteDestinations.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.destCard, { backgroundColor: colors.surface }]}
        onPress={() => handleDestinationPress(item)}
      >
        <View style={styles.cardImage}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="map-pin" size={48} color={colors.primary} />
            </View>
          )}
          <TouchableOpacity
            style={[styles.favoriteBtn, { backgroundColor: colors.surface }]}
            onPress={() => {
              if (isFavorite) {
                dispatch(removeFavoriteDestination(item.id));
              } else {
                dispatch(addFavoriteDestination(item.id));
              }
            }}
          >
            <Feather
              name={isFavorite ? 'heart' : 'heart'}
              size={18}
              color={isFavorite ? '#ff6b6b' : colors.textSecondary}
              fill={isFavorite ? '#ff6b6b' : 'none'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View>
            <Text style={[styles.destName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.destCategory, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.category}
            </Text>
          </View>

          <View style={styles.destFooter}>
            <View style={styles.destDistance}>
              <Feather name="map-pin" size={12} color={colors.primary} />
              <Text style={[styles.distanceText, { color: colors.textSecondary }]}>
                {item.distance}
              </Text>
            </View>
            <View style={styles.destRating}>
              <Feather name="star" size={12} color="#ffc107" fill="#ffc107" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && allDestinations.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore Destinations</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading destinations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore Destinations</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {displayDestinations.length} places to visit
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
              dispatch(clearSearch());
            }}
          >
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {displayDestinations.length > 0 ? (
        <FlatList
          data={displayDestinations}
          renderItem={renderDestinationCard}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="compass" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No destinations found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {searchText ? 'Try a different search term' : 'Explore amazing places around you'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: sp(16),
    paddingTop: sp(12),
    paddingBottom: sp(12),
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fs(24),
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: fs(13),
    marginTop: sp(4),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: sp(16),
    marginVertical: sp(12),
    paddingHorizontal: sp(12),
    height: hp(6),
    borderRadius: sp(10),
    borderWidth: 1,
    gap: sp(10),
  },
  searchInput: {
    flex: 1,
    fontSize: fs(14),
    borderWidth: 0,
  },
  listContent: {
    paddingHorizontal: sp(8),
    paddingBottom: sp(16),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: sp(8),
    marginBottom: sp(8),
  },
  destCard: {
    flex: 1,
    marginHorizontal: sp(8),
    borderRadius: sp(12),
    overflow: 'hidden',
    marginBottom: sp(4),
  },
  cardImage: {
    height: hp(20),
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtn: {
    position: 'absolute',
    top: sp(8),
    right: sp(8),
    width: sp(36),
    height: sp(36),
    borderRadius: sp(18),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: sp(12),
  },
  destName: {
    fontSize: fs(14),
    fontWeight: '700',
    marginBottom: sp(4),
  },
  destCategory: {
    fontSize: fs(12),
    marginBottom: sp(8),
  },
  destFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(4),
  },
  distanceText: {
    fontSize: fs(11),
  },
  destRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(4),
  },
  ratingText: {
    fontSize: fs(12),
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: sp(12),
    fontSize: fs(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sp(32),
  },
  emptyTitle: {
    fontSize: fs(18),
    fontWeight: '600',
    marginTop: sp(16),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fs(14),
    marginTop: sp(8),
    textAlign: 'center',
  },
});
