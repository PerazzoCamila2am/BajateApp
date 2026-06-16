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
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Viaje',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, fontWeight: '900' }}>
              {focused ? 'V' : 'v'}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="routes"
        options={{
          title: 'Lineas',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, fontWeight: '900' }}>
              {focused ? 'L' : 'l'}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
        title: 'Mapa',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 18, fontWeight: '900' }}>
            {focused ? 'M' : 'm'}
          </Text>
         ),
      }}
    />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, fontWeight: '900' }}>
              {focused ? 'C' : 'c'}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Guia',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, fontWeight: '900' }}>
              {focused ? 'G' : 'g'}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
