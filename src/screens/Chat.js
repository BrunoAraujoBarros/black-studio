import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { autenticacao, db } from '../../firebase/fiirebaseconfig';
import { addDoc, collection, doc, orderBy, serverTimestamp, query, onSnapshot } from 'firebase/firestore';

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

    return (
        <GiftedChat
            messages={messages}
            onSend={(text) => onSend(text)}
            user={{ _id: currentUser }}
            placeholder="Digite uma mensagem..."
            renderSend={renderSend}
        />
    );
}

const styles = StyleSheet.create({
    sendButton: {
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
