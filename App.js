import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import Home from './src/screens/Home';
import Chat from './src/screens/Chat';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Registro" 
          component={Registro} 
          options={{ headerShown: true }} 
        />
      
         <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ 
            headerBackVisible: false, 
            title: 'Usuários', 
            headerTitleAlign: 'center',
            headerTitleStyle: {fontWeight: '900'}
        }} 
          />
          <Stack.Screen 
          name="Chat" 
          component={Chat} 
          options={({route}) => ({
            headerBackVisible: false,
            title:route.params.name,
            headerTitleStyle:{fontWeight:'bold'},
            headerTitleAlign:'center'
          })} 
          />

       

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
