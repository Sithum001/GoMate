import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { getThemeColors } from '../utils/colors';

const schema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().required('Password required')
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const auth = useSelector(s => s.auth);
  const theme = useSelector(s => s.theme.mode);
  const colors = getThemeColors(theme === 'dark');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
          <Feather name="navigation" size={48} color="#fff" />
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>GoMate</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your Travel Companion
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        
        {auth.error && (
          <View style={[styles.alertBox, { backgroundColor: colors.primaryLight, borderLeftColor: colors.error }]}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={[styles.alertText, { color: colors.error }]}>{auth.error}</Text>
          </View>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={schema}
          onSubmit={(values) => dispatch(login(values))}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Username</Text>
                <View style={[styles.inputWrapper, { borderColor: touched.username && errors.username ? colors.error : colors.border, backgroundColor: colors.bg }]}>
                  <Feather name="user" size={18} color={colors.textSecondary} />
                  <TextInput 
                    placeholder="Enter username" 
                    style={[styles.input, { color: colors.text }]} 
                    placeholderTextColor={colors.textSecondary}
                    onChangeText={handleChange('username')} 
                    onBlur={handleBlur('username')} 
                    value={values.username} 
                  />
                </View>
                {touched.username && errors.username && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.username}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { borderColor: touched.password && errors.password ? colors.error : colors.border, backgroundColor: colors.bg }]}>
                  <Feather name="lock" size={18} color={colors.textSecondary} />
                  <TextInput 
                    placeholder="Enter password" 
                    secureTextEntry 
                    style={[styles.input, { color: colors.text }]} 
                    placeholderTextColor={colors.textSecondary}
                    onChangeText={handleChange('password')} 
                    onBlur={handleBlur('password')} 
                    value={values.password} 
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={auth.status === 'loading'}
              >
                {auth.status === 'loading' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="arrow-right" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Login</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Register</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.demoText, { color: colors.textSecondary, marginTop: 20 }]}>
          Demo: emilys / emilyspass
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoBox: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  appName: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14 },
  card: { borderRadius: 16, padding: 24, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  alertBox: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 20, borderLeftWidth: 4, gap: 12 },
  alertText: { flex: 1, fontSize: 13, fontWeight: '500' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, gap: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15 },
  error: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  button: { flexDirection: 'row', paddingVertical: 14, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { height: 1, marginVertical: 20 },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  footerText: { fontSize: 13 },
  linkText: { fontSize: 13, fontWeight: '700' },
  demoText: { fontSize: 12, textAlign: 'center', fontStyle: 'italic' }
});

