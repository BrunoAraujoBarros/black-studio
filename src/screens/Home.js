import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, queryEqual, where } from 'firebase/firestore'
import { autenticacao, db } from '../../firebase/fiirebaseconfig'
import { FlatList } from 'react-native';
import { Listitem } from '../../components/Listitem';
import { Button } from 'react-native-elements';


export default function Home({navigation}) {
    const [usuarios, setUsuarios] = useState([]);

    const logoutUsuario = async () => {
      autenticacao.signOut()
      .then(() => {
        navigation.replace('Login')
      })
    }

   const getUsers = async () => {
    const docsRef = collection(db, 'usuarios')
    const q = query(docsRef, where('idusuario', '!=', autenticacao?.currentUser?.uid))
    const docsSnap = onSnapshot(q, (onSnap) => {
        let data = [];
        onSnap.docs.forEach(user => {
            data.push(user.data())
            setUsuarios(data)
            console.log(user.data())
         })
    })
    }
    useEffect(() => {
        getUsers();
    }, [])
  return (
    <>
    <FlatList
    data={usuarios}
    key={user => user.email}
    renderItem={({item}) =>
    <Listitem 
    onPress={() => navigation.navigate('Chat', {name:item.nomedeusuario, uid:item.idusuario})}
    title={item.nomedeusuario}
    subTitle={item.email}
    image={item.avatarURL}
    />
    }
    />
    <Button
    title='Desconectar da Conta'
    onPress={logoutUsuario}
    />
    </>
  )
}

const styles = StyleSheet.create({})