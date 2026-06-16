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
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Viaje',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🚌' : '🚏'}</Text>
          ),
        }}
      />

    <Tabs.Screen
      name="routes"
      options={{
        title: 'Líneas',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '🚍' : '🚌'}</Text>
        ),
      }}
    />
    <Tabs.Screen
      name="realTrip"
      options={{
        title: 'Real',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '✅' : '🚍'}</Text>
        ),
      }}
    />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⭐' : '☆'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🗺️' : '📍'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: 'GPS',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📡' : '📌'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⚙️' : '🔔'}</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Guía',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '💡' : '📘'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}