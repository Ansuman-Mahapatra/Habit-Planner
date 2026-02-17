import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useHabitStore } from '../../store/habitStore';
import { LinearGradient } from 'expo-linear-gradient';
import SpotlightBackground from '../../components/SpotlightBackground';

export default function SettingsScreen() {
  const { user, updateUserName } = useHabitStore();
  const [name, setName] = useState(user?.name || 'Ansuman');
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    if (name.trim()) {
      await updateUserName(name.trim());
      setIsEditing(false);
    }
  };

  return (
    <SpotlightBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            
            <View style={styles.card}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#7C6FFF', '#9D7FFF']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                    autoFocus
                  />
                ) : (
                  <Text style={styles.value}>{name}</Text>
                )}
              </View>

              {isEditing ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setName(user?.name || 'Ansuman');
                      setIsEditing(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <LinearGradient
                      colors={['#7C6FFF', '#6B5FE8']}
                      style={styles.saveButtonGradient}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <LinearGradient
                    colors={['#7C6FFF', '#6B5FE8']}
                    style={styles.editButtonGradient}
                  >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.aboutText}>
                Habit Planner helps you build better habits and track your progress.
              </Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SpotlightBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#16161F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a35',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0F0E17',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#7C6FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#2a2a35',
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutText: {
    color: '#a0a0a0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    color: '#666',
    fontSize: 12,
  },
});
