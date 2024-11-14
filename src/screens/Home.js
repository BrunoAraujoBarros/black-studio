// import { StyleSheet, Text, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import { autenticacao, db } from '../../firebase/fiirebaseconfig';
// import { FlatList } from 'react-native';
// import { Listitem } from '../../components/Listitem';
// import { Button } from 'react-native-elements';
//
// export default function Home({ navigation }) {
//   const [usuarios, setUsuarios] = useState([]);
//
//   const logoutUsuario = async () => {
//     autenticacao.signOut().then(() => {
//       navigation.replace('Login');
//     });
//   };
//
//   const getUsers = () => {
//     const currentUser = autenticacao.currentUser;
//
//     if (!currentUser) return () => {}; // Verifica se o usuário está autenticado
//
//     const docsRef = collection(db, 'usuarios');
//     let q;
//
//     if (currentUser.email === 'blackstudio@gmail.com') {
//       // Se for a conta "blackstudio", exibe todos os usuários, menos ele próprio
//       q = query(docsRef, where('idusuario', '!=', currentUser.uid));
//     } else {
//       // Se for outra conta, exibe apenas o perfil "blackstudio"
//       q = query(docsRef, where('email', '==', 'blackstudio@gmail.com'));
//     }
//
//
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs.map((doc) => doc.data());
//       setUsuarios(data);
//     });
//
//     return unsubscribe;
//   };
//
//   useEffect(() => {
//     const unsubscribe = getUsers();
//     return () => {
//       if (typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);
//
//   return (
//     <>
//       <FlatList
//         data={usuarios}
//         keyExtractor={(item) => item.email}
//         renderItem={({ item }) => (
//           <Listitem
//             onPress={() =>
//               navigation.navigate('Chat', {
//                 name: item.nomedeusuario,
//                 uid: item.idusuario,
//               })
//             }
//             title={item.nomedeusuario}
//             subTitle={item.email}
//             image={item.avatarURL}
//           />
//         )}
//       />
//       <Button title="Desconectar da Conta" onPress={logoutUsuario} />
//     </>
//   );
// }
//
// const styles = StyleSheet.create({});


import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { autenticacao, db } from '../../firebase/fiirebaseconfig';
import { Listitem } from '../../components/Listitem';
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

export default function Home({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);

  const logoutUsuario = async () => {
    autenticacao.signOut().then(() => {
      navigation.replace('Login');
    });
  };

  const getUsers = () => {
    const currentUser = autenticacao.currentUser;

    if (!currentUser) return () => {}; // Verifica se o usuário está autenticado

    const docsRef = collection(db, 'usuarios');
    let q;

    if (currentUser.email === 'blackstudio@gmail.com') {
      // Se for a conta "blackstudio", exibe todos os usuários, menos ele próprio
      q = query(docsRef, where('idusuario', '!=', currentUser.uid));
    } else {
      // Se for outra conta, exibe apenas o perfil "blackstudio"
      q = query(docsRef, where('email', '==', 'blackstudio@gmail.com'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setUsuarios(data);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getUsers();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <>
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                  <Text style={styles.message}>Entre em contato</Text>
      </Animatable.View>


    <View style={styles.containerList}>
    <FlatList
        data={usuarios}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
            <Listitem
                onPress={() =>
                    navigation.navigate('Chat', {
                      name: item.nomedeusuario,
                      uid: item.idusuario,
                    })
                }
                title={item.nomedeusuario}
                subTitle={item.email}
                image={item.avatarURL}
            />
        )}
    />
    </View>
    <Animatable.View animation='fadeInUp' style={styles.buttonContainer}>
      <Button title="Agendar Serviço" onPress={() => navigation.navigate('Appointments')} buttonStyle={styles.button} />
      <Button title="Desconectar da Conta" onPress={logoutUsuario} buttonStyle={styles.button} />
    </Animatable.View>
    </View>
</>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    containerHeader: {
      marginTop: '14%',
      marginBottom: '8%',
      paddingStart: '5%',
  },
    containerList: {
     
        flex:3,
        backgroundColor: '#000000',
        

    },
    buttonContainer: {
      paddingTop: '5%',
      backgroundColor: '#FFF',
      flex: 1,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingStart: '5%',
      paddingEnd: '5%',
    },
    button: {
        backgroundColor: '#142E66',
        borderRadius: 4,
        marginTop: 10,
        marginHorizontal: 5,
    },
    message: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFF',
  },
});