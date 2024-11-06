import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable'
import { Linking } from 'react-native';

export default function Welcome(){
    const openInstagram = (username) => {
        Linking.openURL(`https://www.instagram.com/${username}/`);
    };
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            
            
            <View style={styles.containerLogo} >
                <Animatable.Image 
                animation='flipInY'
                source={require("../../assets/Imagem do WhatsApp de 2024-09-19 à(s) 20.23.57_eb5e31c0.jpg")}
                style={{ width: '80%',  }}
                resizeMode="contain"
                />
            </View>
            <Animatable.View animation='fadeInUp' delay={600} style={styles.containerForm}>
                <Text style={styles.title}>Bem vindo!</Text>
                <Text style={styles.textEndrese}>
                Estúdio de tatuagem e piercing {'\n'}
                Braga 🇵🇹 {'\n'}
                ⚜️Tattoo{' '}
                <Text 
                    style={styles.link} 
                    onPress={() => openInstagram('necromant.tt')}
                >
                    @necromant.tt
                </Text> {' '}
                <Text 
                    style={styles.link} 
                    onPress={() => openInstagram('leocadio_victor')}
                >
                    @leocadio_victor
                </Text> {'\n'}
                ⚜️Piercing{' '}
                <Text 
                    style={styles.link} 
                    onPress={() => openInstagram('larispiercer')}
                >
                    @larispiercer
                </Text>
                </Text>
                <Text style={styles.text}>Realize o login!</Text>

                <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#000000'

    },
    link: {
        color: '#142E66',
    },
    containerLogo:{
        flex:2,
        backgroundColor: '#000000',
        justifyContent:'center',
        alignItems: 'center',
        
        

    },
    containerForm: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'

    },
    title:{
        fontSize:24,
        fontWeight: 'bold',
        marginTop:28,
        marginBottom: 12
    },
    text:{
        paddingTop: 20,
        color: '#a1a1a1'
    },
    button:{
        position: 'absolute',
        backgroundColor: '#142E66',
        borderRadius:50,
        paddingVertical:8,
        width:'60%',
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{
        fontSize:18,
        color: '#FFF',
        fontWeight: 'bold'
    },

})