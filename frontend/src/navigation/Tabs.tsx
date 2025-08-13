import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientsScreen from '../screens/ClientsScreen';
import StatsScreen from '../screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Clientes" component={ClientsScreen} />
      <Tab.Screen name="Estatísticas" component={StatsScreen} />
    </Tab.Navigator>
  );
}
