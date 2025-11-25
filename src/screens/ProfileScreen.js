import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.username || user?.firstName || 'Guest'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@gomate.app'}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Feather name="moon" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={theme === 'dark'} 
              onValueChange={() => dispatch(toggleTheme())} 
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Account Info</Text>
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Username</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.username || 'N/A'}</Text>
          </View>
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Account Type</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Premium User</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: colors.error }]}
          onPress={() => dispatch(logout())}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 32, paddingHorizontal: 20, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  userName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  infoItem: { paddingVertical: 12, borderBottomWidth: 1 },
  infoLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 20 },
  logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
