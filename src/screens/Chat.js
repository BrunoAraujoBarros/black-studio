import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import { autenticacao, db } from '../../firebase/fiirebaseconfig';
import { addDoc, collection, doc, orderBy, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import * as Animatable from 'react-native-animatable';

export default function Chat({ route }) {
    const { uid } = route.params || {};
    if (!uid) {
        console.error('UID não foi passado para o componente Chat');
        return <Text>UID não disponível</Text>;
    }

    const [messages, setMessages] = useState([]);
    const currentUser = autenticacao?.currentUser?.uid;

    useEffect(() => {
        const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
        const docRef = doc(db, 'chatrooms', chatId);
        const colRef = collection(docRef, 'messages');
        const q = query(colRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allMessages = snapshot.docs.map((msg) => ({
                ...msg.data(),
                createdAt: msg.data().createdAt?.toDate() || new Date(),
            }));
            setMessages(allMessages);
        });

        return () => unsubscribe();
    }, []);

    const onSend = useCallback((messagesArray) => {
        const msg = messagesArray[0];
        const myMsg = {
            _id: Math.random().toString(36).substring(7),
            text: msg.text,
            createdAt: new Date(),
            user: { _id: currentUser },
        };

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [myMsg])
        );

        const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
        const docRef = doc(db, 'chatrooms', chatId);
        const colRef = collection(docRef, 'messages');

        addDoc(colRef, { ...myMsg, createdAt: serverTimestamp() });
    }, [currentUser]);

    const renderSend = (props) => (
        <Send {...props}>
            <View style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Enviar</Text>
            </View>
        </Send>
    );
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#142E66', // Cor das mensagens enviadas
                    },
                    left: {
                        backgroundColor: '#1a1a1a', // Cor das mensagens recebidas
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff', // Cor do texto das mensagens enviadas
                    },
                    left: {
                        color: '#fff', // Cor do texto das mensagens recebidas
                    },
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                  <Text style={styles.message}>Black Studio</Text>
             </Animatable.View>
       
        <GiftedChat
        
            messages={messages}
            onSend={(text) => onSend(text)}
            user={{ _id: currentUser }}
            placeholder="Digite uma mensagem..."
            renderSend={renderSend}
            renderBubble={renderBubble}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    sendButton: {
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: '#142E66',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
});
