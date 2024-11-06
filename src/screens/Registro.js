import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { autenticacao, db } from '../../firebase/fiirebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import * as Animatable from 'react-native-animatable';

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
                setDoc(docRef, {
                    avatarURL: avatar ? avatar : 'https://cdn-icons-png.flaticon.com/512/266/266033.png',
                    nomedeusuario,
                    senha,
                    idusuario,
                    email
                });
            })
            .then(() => console.log('Usuário registrado com sucesso!'))
            .catch((error) => console.error(error.message));
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Crie sua conta</Text>
            </Animatable.View>

            <Animatable.View animation='fadeInUp' style={styles.containerForm}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder='Coloque seu email'
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        leftIcon={{ type: 'material', name: 'email' }}
                    />
                    <Input
                        placeholder='Coloque sua senha'
                        label='Senha'
                        value={senha}
                        onChangeText={setSenha}
                        leftIcon={{ type: 'material', name: 'lock' }}
                        secureTextEntry
                    />
                    <Input
                        placeholder='Digite um nome de Usuário'
                        label='Usuário'
                        value={nomedeusuario}
                        onChangeText={setNomedeusuario}
                        leftIcon={{ type: 'material', name: 'account-circle' }}
                    />
                    <Input
                        placeholder='Coloque o URL do avatar'
                        label='Avatar'
                        value={avatar}
                        onChangeText={setAvatar}
                        leftIcon={{ type: 'material', name: 'link' }}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                        onPress={registroUsuario}
                        title='REGISTRAR-SE' 
                        buttonStyle={styles.button}
                    />
                    <Button
                        onPress={() => navigation.navigate('Login')}  
                        title='VOLTE PARA LOGIN'
                        buttonStyle={styles.button}
                    />
                </View>
            </Animatable.View>
        </View>
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
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    containerForm: {
        paddingTop: '5%',
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#142E66',
        borderRadius: 4,
        paddingVertical: 10,
        marginTop: 14,
    },
});
