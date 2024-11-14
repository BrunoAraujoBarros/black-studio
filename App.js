// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Login from './src/screens/Login';
// import Registro from './src/screens/Registro';
// import Home from './src/screens/Home';
// import Chat from './src/screens/Chat';
//
//
//
// const Stack = createNativeStackNavigator();
//
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="Registro"
//           component={Registro}
//           options={{ headerShown: true }}
//         />
//
//          <Stack.Screen
//           name="Home"
//           component={Home}
//           options={{
//             headerBackVisible: false,
//             title: 'Usuários',
//             headerTitleAlign: 'center',
//             headerTitleStyle: {fontWeight: '900'}
//         }}
//           />
//           <Stack.Screen
//           name="Chat"
//           component={Chat}
//           options={({route}) => ({
//             headerBackVisible: false,
//             title:route.params.name,
//             headerTitleStyle:{fontWeight:'bold'},
//             headerTitleAlign:'center'
//           })}
//           />
//
//
//
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import Home from './src/screens/Home';
import Chat from './src/screens/Chat';
import Appointments from './src/screens/Appointments';
import Welcome from './src/screens/Welcome';
import Portfolio from './src/screens/Portfolio';
import AdminPortfolio from './src/screens/AdminPortfolio';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Registro"
                    component={Registro}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerBackVisible: false,
                        headerShown: false,
                        title: 'Usuários',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontWeight: '900' }
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={({route}) => ({
                        headerShown: false ,
                        headerBackVisible: false,
                        title: route.params.name,
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerTitleAlign: 'center'
                    })}
                />
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Appointments"
                    component={Appointments}
                    options={{
                        title: 'Agendar Serviço',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                />
                <Stack.Screen
                    name="Portfolio"
                    component={Portfolio}
                    options={{
                        title: 'Portfólio',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                />
                <Stack.Screen
                    name="AdminPortfolio"
                    component={AdminPortfolio}
                    options={{
                        title: 'Gerenciar Portfólio',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
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
