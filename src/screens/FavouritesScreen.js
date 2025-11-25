import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ItemCard from '../components/ItemCard';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';
import { removeFavourite } from '../store/slices/favouritesSlice';
import { wp, hp, fs, sp } from '../utils/responsive';

export default function FavouritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const routeFavs = useSelector(s => s.favourites.items);
  const destinationFavIds = useSelector(s => s.destinations.favoriteDestinations);
  const allDestinations = useSelector(s => s.destinations.destinations);
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');
  
  const [activeTab, setActiveTab] = useState('routes'); // 'routes' or 'destinations'

  // Get full destination objects from IDs
  const destinationFavs = allDestinations.filter(dest => 
    destinationFavIds.includes(dest.id)
  );

  const totalFavs = routeFavs.length + destinationFavs.length;

  if (totalFavs === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.bg }]}>
        <Feather name="heart" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favourites Yet</Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Mark routes and destinations as favourite to save them here
        </Text>
      </View>
    );
  }

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.destCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('Details', { item: { 
        id: item.id,
        title: item.name,
        description: item.description,
        rating: item.rating,
        price: item.distance,
        images: [item.image],
        thumbnail: item.image,
        brand: item.category
      }})}
    >
      <Image source={{ uri: item.image }} style={styles.destImage} />
      <View style={styles.destContent}>
        <Text style={[styles.destName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.destCategory, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.category}
        </Text>
        <View style={styles.destFooter}>
          <View style={styles.destInfo}>
            <Feather name="map-pin" size={12} color={colors.primary} />
            <Text style={[styles.destInfoText, { color: colors.textSecondary }]}>
              {item.distance}
            </Text>
          </View>
          <View style={styles.destInfo}>
            <Feather name="star" size={12} color="#ffc107" />
            <Text style={[styles.destInfoText, { color: colors.text }]}>
              {item.rating}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => dispatch({ type: 'destinations/removeFavoriteDestination', payload: item.id })}
      >
        <Feather name="x" size={18} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[{ flex: 1 }, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Favourites</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {totalFavs} saved item{totalFavs !== 1 ? 's' : ''}
          </Text>
        </View>
        <Feather name="heart" size={32} color={colors.error} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            { borderBottomColor: activeTab === 'routes' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('routes')}
        >
          <Feather 
            name="navigation" 
            size={20} 
            color={activeTab === 'routes' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'routes' ? colors.primary : colors.textSecondary }
          ]}>
            Routes ({routeFavs.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            { borderBottomColor: activeTab === 'destinations' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('destinations')}
        >
          <Feather 
            name="map-pin" 
            size={20} 
            color={activeTab === 'destinations' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'destinations' ? colors.primary : colors.textSecondary }
          ]}>
            Places ({destinationFavs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'routes' ? (
        routeFavs.length > 0 ? (
          <FlatList 
            data={routeFavs} 
            keyExtractor={i => String(i.id)} 
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('Details', { item })}
                right={(
                  <Feather
                    name="heart"
                    size={20}
                    color={colors.error}
                    onPress={() => dispatch(removeFavourite(item.id))}
                  />
                )}
              />
            )} 
            contentContainerStyle={{ padding: sp(16) }}
          />
        ) : (
          <View style={styles.emptyTab}>
            <Feather name="navigation" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTabText, { color: colors.textSecondary }]}>
              No route favourites yet
            </Text>
          </View>
        )
      ) : (
        destinationFavs.length > 0 ? (
          <FlatList 
            data={destinationFavs}
            keyExtractor={i => String(i.id)}
            renderItem={renderDestinationCard}
            contentContainerStyle={{ padding: sp(16) }}
          />
        ) : (
          <View style={styles.emptyTab}>
            <Feather name="map-pin" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTabText, { color: colors.textSecondary }]}>
              No destination favourites yet
            </Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({ 
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: sp(20) 
  },
  emptyTitle: { 
    fontSize: fs(20), 
    fontWeight: '700', 
    marginTop: sp(16), 
    marginBottom: sp(8) 
  },
  emptyDesc: { 
    fontSize: fs(13), 
    textAlign: 'center' 
  },
  header: { 
    paddingVertical: sp(16), 
    paddingHorizontal: sp(16), 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1
  },
  headerTitle: { 
    fontSize: fs(24), 
    fontWeight: '800' 
  },
  headerSubtitle: { 
    fontSize: fs(13), 
    marginTop: sp(4) 
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sp(14),
    gap: sp(8),
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: fs(14),
    fontWeight: '600',
  },
  emptyTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: sp(60),
  },
  emptyTabText: {
    marginTop: sp(12),
    fontSize: fs(14),
    fontWeight: '500',
  },
  destCard: {
    flexDirection: 'row',
    borderRadius: sp(12),
    marginBottom: sp(12),
    borderWidth: 1,
    overflow: 'hidden',
    padding: sp(12),
    gap: sp(12),
  },
  destImage: {
    width: wp(25),
    height: hp(12),
    borderRadius: sp(8),
    backgroundColor: '#f0f0f0',
  },
  destContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  destName: {
    fontSize: fs(15),
    fontWeight: '700',
    marginBottom: sp(4),
  },
  destCategory: {
    fontSize: fs(12),
    marginBottom: sp(8),
  },
  destFooter: {
    flexDirection: 'row',
    gap: sp(12),
  },
  destInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(4),
  },
  destInfoText: {
    fontSize: fs(11),
    fontWeight: '500',
  },
  removeBtn: {
    width: sp(32),
    height: sp(32),
    borderRadius: sp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
