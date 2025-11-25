import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';
import { fetchSchedules, setSelectedRoute } from '../store/slices/schedulesSlice';
import { fetchItems } from '../store/slices/itemsSlice';
import { wp, hp, fs, sp } from '../utils/responsive';

export default function SchedulesScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = getThemeColors(isDark);
  
  const { schedules, selectedRoute, loading } = useSelector(state => state.schedules);
  const { data: routes, loading: routesLoading } = useSelector(state => state.items);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchSchedules());
    // Load routes if not already loaded
    if (!routes || routes.length === 0) {
      dispatch(fetchItems());
    }
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchSchedules()).then(() => setRefreshing(false));
  }, [dispatch]);

  const currentSchedules = selectedRoute && schedules[selectedRoute] ? schedules[selectedRoute] : [];
  const currentRouteData = routes?.find(r => r.id === selectedRoute);

  const handleBookSchedule = (schedule) => {
    Alert.alert(
      'Book Trip',
      `Book ${schedule.time} departure to ${schedule.destination}?\n\nDuration: ${schedule.duration}\nCapacity: ${schedule.capacity}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => Alert.alert('Success', 'Trip booked successfully!') 
        }
      ]
    );
  };

  const renderScheduleItem = ({ item, index }) => (
    <View style={[styles.scheduleCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: colors.primary }]}>{item.time}</Text>
        <Text style={[styles.ampmText, { color: colors.textSecondary }]}>Departs</Text>
      </View>

      <View style={styles.scheduleDetails}>
        <Text style={[styles.destinationText, { color: colors.text }]}>{item.destination}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Feather name="clock" size={14} color={colors.primary} />
            <Text style={[styles.infoPillText, { color: colors.text }]}>{item.duration}</Text>
          </View>
          <View style={[styles.infoPill, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="users" size={14} color={colors.primary} />
            <Text style={[styles.infoPillText, { color: colors.text }]}>{item.capacity}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.bookBtn, { backgroundColor: colors.primary }]}
        onPress={() => {
          console.log('Button pressed!', item);
          handleBookSchedule(item);
        }}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="arrow-right" size={sp(18)} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderRouteButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.routeButton,
        {
          backgroundColor: selectedRoute === item.id ? colors.primary : colors.surface,
          borderColor: colors.primary,
        },
      ]}
      onPress={() => dispatch({ type: 'schedules/setSelectedRoute', payload: item.id })}
    >
      <Text
        style={[
          styles.routeButtonText,
          { color: selectedRoute === item.id ? '#fff' : colors.text },
        ]}
      >
        {item.name || `Route ${item.id}`}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !currentSchedules.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Schedules</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading schedules...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Schedules</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {routes?.length || 0} routes available
        </Text>
      </View>

      <ScrollView
        style={styles.routesScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.routesContainer}
      >
        {routes && routes.map((route, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.routeButton,
              {
                backgroundColor: selectedRoute === route.id ? colors.primary : colors.surface,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => dispatch(setSelectedRoute(route.id))}
          >
            <Text
              style={[
                styles.routeButtonText,
                { color: selectedRoute === route.id ? '#fff' : colors.text },
              ]}
            >
              {route.name || `Route ${route.id}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {currentSchedules.length > 0 ? (
        <ScrollView 
          style={styles.schedulesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleHeaderTitle, { color: colors.text }]}>
              {currentRouteData?.name || `Route ${selectedRoute}`}
            </Text>
            <Text style={[styles.scheduleHeaderSubtitle, { color: colors.textSecondary }]}>
              {currentSchedules.length} departures today
            </Text>
          </View>

          {currentSchedules.map((item, idx) => (
            <View key={`${selectedRoute}-${idx}`} style={styles.scheduleItemWrapper}>
              {renderScheduleItem({ item, index: idx })}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No schedules available</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Select a route to view available departures
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
    marginBottom: sp(4),
  },
  headerSubtitle: {
    fontSize: fs(14),
  },
  routesScroll: {
    paddingHorizontal: sp(16),
    paddingVertical: sp(12),
  },
  routesContainer: {
    gap: sp(8),
  },
  routeButton: {
    paddingHorizontal: sp(16),
    paddingVertical: sp(10),
    borderRadius: sp(8),
    borderWidth: 1.5,
  },
  routeButtonText: {
    fontSize: fs(14),
    fontWeight: '600',
  },
  schedulesList: {
    flex: 1,
    paddingHorizontal: sp(16),
    paddingTop: sp(12),
  },
  scheduleHeader: {
    marginBottom: sp(12),
  },
  scheduleHeaderTitle: {
    fontSize: fs(18),
    fontWeight: '700',
    marginBottom: sp(4),
  },
  scheduleHeaderSubtitle: {
    fontSize: fs(12),
  },
  listContent: {
    gap: sp(12),
    paddingBottom: sp(16),
  },
  scheduleItemWrapper: {
    marginBottom: sp(12),
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp(12),
    borderRadius: sp(12),
    borderWidth: 1,
    gap: sp(12),
  },
  timeContainer: {
    alignItems: 'center',
    minWidth: sp(50),
  },
  timeText: {
    fontSize: fs(18),
    fontWeight: '700',
  },
  ampmText: {
    fontSize: fs(10),
    marginTop: sp(2),
  },
  scheduleDetails: {
    flex: 1,
  },
  destinationText: {
    fontSize: fs(14),
    fontWeight: '600',
    marginBottom: sp(6),
  },
  infoRow: {
    flexDirection: 'row',
    gap: sp(8),
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(4),
    paddingHorizontal: sp(8),
    paddingVertical: sp(4),
    borderRadius: sp(6),
    backgroundColor: 'transparent',
  },
  infoPillText: {
    fontSize: fs(11),
    fontWeight: '500',
  },
  bookBtn: {
    width: sp(44),
    height: sp(44),
    borderRadius: sp(10),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
