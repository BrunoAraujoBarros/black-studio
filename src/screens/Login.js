import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../../firebase/fiirebaseconfig';

export default function Login({ navigation }) {  
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const loginUsuario = async (navigation) => {
        signInWithEmailAndPassword(autenticacao, email, senha)
        .then(()=> console.log('user logged in'))
    }
    
    useEffect(() => {
        onAuthStateChanged(autenticacao, (user) => {
            if(user){
                navigation.navigate('Home')
            }else{
                console.log('no user')
            }
        })
    },[])

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
            <Button 
                style={styles.botao}
                onPress={loginUsuario}
                title='ENTRAR' />
            <Button
                onPress={() => navigation.navigate('Registro')}  
                style={styles.botao}
                title='REGISTRAR-SE'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    botao: {
        marginTop: 10,
    },
});
