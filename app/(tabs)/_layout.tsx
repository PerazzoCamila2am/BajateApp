import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5DE2A3',
        tabBarInactiveTintColor: '#8FA1B3',
        tabBarStyle: {
          backgroundColor: '#101820',
          borderTopColor: '#263544',
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Viaje',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🚌' : '🚏'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: 'GPS',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '📡' : '📍'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '⚙️' : '🔔'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Guía',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '💡' : '📘'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}