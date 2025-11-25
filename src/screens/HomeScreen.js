import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  Button, 
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../store/slices/itemsSlice';
import ItemCard from '../components/ItemCard';
import { addFavourite, removeFavourite } from '../store/slices/favouritesSlice';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';
import { wp, hp, fs, sp } from '../utils/responsive';

const TRAVEL_METHODS = [
  { id: 'bus', label: 'Bus', icon: 'truck' },
  { id: 'train', label: 'Train', icon: 'zap' },
  { id: 'metro', label: 'Metro', icon: 'navigation' },
  { id: 'tram', label: 'Tram', icon: 'minimize-2' },
  { id: 'ferry', label: 'Ferry', icon: 'anchor' },
];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector(s => s.items.list);
  const status = useSelector(s => s.items.status);
  const error = useSelector(s => s.items.error);
  const favs = useSelector(s => s.favourites.items);
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');

  const [selectedMethod, setSelectedMethod] = useState('bus');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => { dispatch(fetchItems()); }, [dispatch]);

  const isFav = id => favs.some(i => i.id === id);

  const handleSearch = () => {
    if (fromLocation.trim() && toLocation.trim()) {
      setSearchActive(true);
      dispatch(fetchItems({ method: selectedMethod, from: fromLocation, to: toLocation }));
    }
  };

  // Filter items based on selected method and search locations
  const filteredItems = items.filter(item => {
    // If search is active, filter by locations
    if (searchActive && fromLocation && toLocation) {
      const itemTitle = item.title?.toLowerCase() || '';
      const itemDesc = item.description?.toLowerCase() || '';
      const from = fromLocation.toLowerCase();
      const to = toLocation.toLowerCase();
      
      // Check if route description or title mentions either location
      const matchesLocations = itemTitle.includes(from) || itemTitle.includes(to) ||
                               itemDesc.includes(from) || itemDesc.includes(to);
      
      if (!matchesLocations) return false;
    }

    // Filter by travel method
    const methodMatch = 
      selectedMethod === 'bus' ? 
        (item.title?.toLowerCase().includes('route') || item.title?.toLowerCase().includes('bus')) :
      selectedMethod === 'train' ? 
        (item.title?.toLowerCase().includes('line') && !item.title?.toLowerCase().includes('piccadilly')) :
      selectedMethod === 'metro' ?
        (item.title?.toLowerCase().includes('line') || item.title?.toLowerCase().includes('metro') || 
         item.title?.toLowerCase().includes('district') || item.title?.toLowerCase().includes('piccadilly')) :
      selectedMethod === 'tram' ?
        (item.title?.toLowerCase().includes('tram')) :
      selectedMethod === 'ferry' ?
        (item.title?.toLowerCase().includes('ferry') || item.title?.toLowerCase().includes('boat')) :
      true;
      
    return methodMatch;
  });

  const render = ({ item }) => (
    <ItemCard
      item={item}
      onPress={(i) => navigation.navigate('Details', { item: i })}
      right={(
        <Feather
          name={isFav(item.id) ? 'heart' : 'heart'}
          size={20}
          color={isFav(item.id) ? '#ff6b6b' : colors.textSecondary}
          onPress={() => dispatch(isFav(item.id) ? removeFavourite(item.id) : addFavourite(item))}
        />
      )}
    />
  );

  if (status === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading transport routes...</Text>
      </View>
    );
  }

  if (status === 'failed' && !items.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Unable to load routes</Text>
        <Text style={[styles.errorDesc, { color: colors.textSecondary }]}>{error}</Text>
        <Button title="Try Again" onPress={() => dispatch(fetchItems())} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Plan Your Journey</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Choose travel method and destination
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: sp(20) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Travel Method Selector */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Travel Method</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.methodsContainer}
          >
            {TRAVEL_METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  { 
                    backgroundColor: selectedMethod === method.id ? colors.primary : colors.surface,
                    borderColor: colors.border 
                  }
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Feather 
                  name={method.icon} 
                  size={24} 
                  color={selectedMethod === method.id ? '#fff' : colors.text} 
                />
                <Text style={[
                  styles.methodLabel,
                  { color: selectedMethod === method.id ? '#fff' : colors.text }
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* From/To Location Inputs */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Journey Details</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather name="map-pin" size={20} color={colors.primary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="From (e.g., Victoria Station)"
              placeholderTextColor={colors.textSecondary}
              value={fromLocation}
              onChangeText={setFromLocation}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather name="navigation" size={20} color={colors.error} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="To (e.g., Oxford Street)"
              placeholderTextColor={colors.textSecondary}
              value={toLocation}
              onChangeText={setToLocation}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.searchButton,
              { 
                backgroundColor: fromLocation && toLocation ? colors.primary : colors.surface,
                borderColor: colors.border 
              }
            ]}
            onPress={handleSearch}
            disabled={!fromLocation || !toLocation}
          >
            <Feather 
              name="search" 
              size={20} 
              color={fromLocation && toLocation ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.searchButtonText,
              { color: fromLocation && toLocation ? '#fff' : colors.textSecondary }
            ]}>
              Search Routes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available Routes
            </Text>
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {filteredItems.length} routes
            </Text>
          </View>

          {status === 'loading' ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading routes...
              </Text>
            </View>
          ) : status === 'failed' && !items.length ? (
            <View style={styles.centerContent}>
              <Feather name="alert-triangle" size={48} color={colors.error} />
              <Text style={[styles.errorTitle, { color: colors.text }]}>Unable to load routes</Text>
              <Text style={[styles.errorDesc, { color: colors.textSecondary }]}>{error}</Text>
              <Button title="Try Again" onPress={() => dispatch(fetchItems())} />
            </View>
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <View key={item.id}>
                {render({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchActive ? 
                  'No routes found for your search' : 
                  'Select destinations to search for routes'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1 },
  header: { 
    paddingVertical: sp(20), 
    paddingHorizontal: sp(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  headerTitle: { fontSize: fs(28), fontWeight: '800' },
  headerSubtitle: { fontSize: fs(14), marginTop: sp(4) },
  sectionContainer: {
    paddingHorizontal: sp(16),
    marginTop: sp(20),
  },
  sectionTitle: {
    fontSize: fs(18),
    fontWeight: '700',
    marginBottom: sp(12),
  },
  methodsContainer: {
    paddingVertical: sp(4),
    gap: sp(12),
  },
  methodCard: {
    paddingHorizontal: sp(20),
    paddingVertical: sp(16),
    borderRadius: sp(12),
    borderWidth: 1,
    alignItems: 'center',
    gap: sp(8),
    minWidth: wp(22),
  },
  methodLabel: {
    fontSize: fs(13),
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sp(16),
    paddingVertical: sp(14),
    borderRadius: sp(12),
    borderWidth: 1,
    marginBottom: sp(12),
    gap: sp(12),
  },
  input: {
    flex: 1,
    fontSize: fs(15),
    fontWeight: '500',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sp(16),
    borderRadius: sp(12),
    borderWidth: 1,
    gap: sp(10),
    marginTop: sp(8),
  },
  searchButtonText: {
    fontSize: fs(16),
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sp(8),
  },
  resultCount: {
    fontSize: fs(13),
    fontWeight: '600',
  },
  centerContent: { 
    alignItems: 'center', 
    paddingVertical: sp(40) 
  },
  loadingText: { 
    marginTop: sp(12), 
    fontSize: fs(14) 
  },
  errorTitle: { 
    fontSize: fs(18), 
    fontWeight: '700', 
    marginTop: sp(16), 
    marginBottom: sp(8) 
  },
  errorDesc: { 
    fontSize: fs(13), 
    textAlign: 'center', 
    marginBottom: sp(16) 
  },
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: sp(40) 
  },
  emptyText: { 
    marginTop: sp(12), 
    fontSize: fs(14), 
    fontWeight: '500',
    textAlign: 'center',
  }
});
