import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';
import { hp, fs, sp } from '../utils/responsive';

export default function ItemCard({ item, onPress, right }) {
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]} 
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail || item.images?.[0] }} style={styles.img} />
      
      <View style={styles.contentWrapper}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={[styles.desc, { color: colors.textSecondary }]}>
            {item.description || item.brand}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.ratingBox}>
              <Feather name="star" size={14} color="#ffc107" />
              <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
            </View>
            {item.price && (
              <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.favButton} onPress={() => right?.props?.onPress()}>
          {right}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    borderRadius: sp(12), 
    marginBottom: sp(12), 
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2
  },
  img: { width: '100%', height: hp(18), backgroundColor: '#f0f0f0' },
  contentWrapper: { 
    flexDirection: 'row', 
    padding: sp(12), 
    justifyContent: 'space-between',
    gap: sp(12)
  },
  title: { fontWeight: '700', fontSize: fs(14), marginBottom: sp(4) },
  desc: { marginTop: sp(2), fontSize: fs(12), lineHeight: fs(16) },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: sp(8) 
  },
  ratingBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: sp(4) 
  },
  rating: { fontSize: fs(12), fontWeight: '600' },
  price: { fontWeight: '700', fontSize: fs(13) },
  favButton: { justifyContent: 'center' }
});
