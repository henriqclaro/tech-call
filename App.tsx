import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import CallDetailScreen from './src/app/call-detail';
import CallListScreen from './src/app/call-list';
import NewCallScreen from './src/app/new-call';

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef<any>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        Notifications.setNotificationChannelAsync('chamados', {
          name: 'Atualizações de chamados',
          importance: Notifications.AndroidImportance.HIGH,
        }).catch((err) => console.log('Canal já existe ou falhou ao registrar:', err));
      } catch (error) {
        console.error('Erro ao criar canal de notificações:', error);
      }
    }
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { chamadoId } = (response.notification.request.content.data ?? {}) as any;
      if (chamadoId && navigationRef.isReady()) {
        navigationRef.navigate('CallDetail', { chamadoId });
      }
    });

    const response = Notifications.getLastNotificationResponse();
    const chamadoId = response?.notification.request.content.data?.chamadoId;
    if (chamadoId && navigationRef.isReady()) {
      navigationRef.navigate('CallDetail', { chamadoId });
    }

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="CallList">
        <Stack.Screen
          name="CallDetail"
          component={CallDetailScreen}
          options={{ title: 'Detalhes do Chamado' }}
        />
        <Stack.Screen name="CallList" component={CallListScreen} options={{ title: 'Chamados' }} />
        <Stack.Screen
          name="NewCall"
          component={NewCallScreen}
          options={{ title: 'Novo Chamado' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
