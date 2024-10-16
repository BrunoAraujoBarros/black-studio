import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { autenticacao, db } from '../../firebase/fiirebaseconfig';
import { doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';


export default function Registro({ navigation }) {  
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nomedeusuario, setNomedeusuario] = useState('');
    const [avatar, setAvatar] = useState('');

    const registroUsuario = async () => {
        createUserWithEmailAndPassword(autenticacao, email, senha)
            .then((userCredentials) => {
                const idusuario = userCredentials.user.uid;
                const docRef = doc(db, 'usuarios', idusuario );
                const docSnap = setDoc(docRef, {
                    avatarURL: avatar ? avatar : 'https://cdn-icons-png.flaticon.com/512/266/266033.png',
                    nomedeusuario,
                    senha,
                    idusuario,
                    email

                })
            })
            .then(() => console.log('BOA GAROTO'))
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder='Coloque seu email'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                leftIcon={{ type: 'material', name: 'email' }}
            />
            <Input
                placeholder='Coloque sua senha'
                label='Senha'
                value={senha}
                onChangeText={text => setSenha(text)}
                leftIcon={{ type: 'material', name: 'lock' }}
                secureTextEntry
            />
            <Input
                placeholder='Digite um nome de Usuário'
                label='Usuário'
                value={nomedeusuario}
                onChangeText={text => setNomedeusuario(text)}
                leftIcon={{ type: 'material', name: 'account-circle' }}
            />
            <Input
                placeholder='Coloque o URL do avatar'
                label='Avatar'
                value={avatar}
                onChangeText={text => setAvatar(text)}
                leftIcon={{ type: 'material', name: 'link' }}
                
            />
            <Button title='ENTRAR' />
            <Button 
                onPress={registroUsuario}
                style={styles.botao}
                title='REGISTRAR-SE'
            />
            <Button
                style={styles.botao}
                onPress={() => navigation.navigate('Login')}  
                title='VOLTE PARA LOGIN'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    botao: {
        marginTop: 10,
    },
});
