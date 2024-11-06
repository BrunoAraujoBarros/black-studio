import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../../firebase/fiirebaseconfig';
import * as Animatable from 'react-native-animatable';

export default function Login({ navigation }) {  
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const loginUsuario = () => {
        signInWithEmailAndPassword(autenticacao, email, senha)
        .then(() => {
            console.log('Usuário Logado');
            navigation.navigate('Home'); // Navegação para a Home após login bem-sucedido
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(autenticacao, (user) => {
            if (user) {
                navigation.navigate('Home'); // Se já estiver logado, redireciona para a Home
            } else {
                console.log('Sem Usuário');
            }
        });

        return () => unsubscribe(); // Limpa a assinatura quando o componente for desmontado
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Realize o seu login</Text>
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
                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                        onPress={loginUsuario}
                        title='ENTRAR' 
                        buttonStyle={styles.button}
                    />
                    <Button
                        onPress={() => navigation.navigate('Registro')}  
                        title='REGISTRAR-SE'
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
        paddingTop: '10%',
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
