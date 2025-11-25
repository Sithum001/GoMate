import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params || {};
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="alert-circle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text, marginTop: 16 }]}>No route details available</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.thumbnail || item.images?.[0] }} style={styles.heroImage} />
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        
        <View style={[styles.ratingContainer, { backgroundColor: colors.surface }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="star" size={20} color="#ffc107" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
          </View>
          {item.price && (
            <Text style={[styles.priceTag, { color: colors.primary, backgroundColor: colors.primaryLight }]}>
              {item.price}
            </Text>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>About Route</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

        <View style={[styles.detailsGrid, { backgroundColor: colors.surface }]}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="truck" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Operator</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.brand}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="map-pin" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>Public Transport</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
        >
          <Feather name="arrow-left" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Back to Routes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: '100%', height: 260 },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12 },
  ratingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12 },
  ratingText: { fontSize: 16, fontWeight: '700' },
  priceTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontSize: 13, fontWeight: '700', marginLeft: 'auto' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 22 },
  detailsGrid: { marginTop: 20, padding: 16, borderRadius: 12, flexDirection: 'row', gap: 16 },
  detailItem: { flex: 1, alignItems: 'center' },
  detailIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  detailLabel: { fontSize: 12, marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  ctaBtn: { flexDirection: 'row', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
