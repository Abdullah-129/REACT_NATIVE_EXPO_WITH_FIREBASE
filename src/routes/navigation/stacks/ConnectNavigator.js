import React, { useContext } from 'react';
import { Text, View } from 'react-native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { ColorSchemeContext } from '../../../context/ColorSchemeContext';
import { UserDataContext } from '../../../context/UserDataContext';
import { lightProps, darkProps } from './navigationProps/navigationProps';
import HeaderStyle from './headerComponents/HeaderStyle';
import HeaderRightButton from '../../../components/HeaderRightButton';
import Home from '../../../scenes/logs';
import Logs from '../../../scenes/logs';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const ConnectNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext);
  const { userData } = useContext(UserDataContext);
  const navigationProps = scheme === 'dark' ? darkProps : lightProps;

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="LOGS"
          component={Logs} // Replace with the actual component for the "LOGS" screen
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
            headerRight: () => <HeaderRightButton from='Connect' userData={userData} />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
