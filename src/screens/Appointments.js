// src/screens/Appointments.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../../firebase/fiirebaseconfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const availableTimes = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const Appointments = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [service, setService] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [bookedTimes, setBookedTimes] = useState([]);

    // Função para confirmar e salvar o agendamento
    const handleConfirm = async () => {
        if (name && service && selectedDate && selectedTime) {
            if (bookedTimes.includes(selectedTime)) {
                Alert.alert('Horário indisponível', 'Esse horário já está reservado. Por favor, escolha outro.');
                return;
            }
            try {
                const appointmentsRef = collection(db, 'appointments');
                await addDoc(appointmentsRef, {
                    name,
                    service,
                    date: selectedDate,
                    time: selectedTime,
                });
                Alert.alert('Agendamento confirmado!');
                setName('');
                setService('');
                setSelectedDate('');
                setSelectedTime('');
                fetchAppointments(); // Atualiza a lista após agendar
            } catch (error) {
                Alert.alert('Erro ao agendar', error.message);
            }
        } else {
            Alert.alert('Por favor, preencha todos os campos');
        }
    };

    // Função para buscar os agendamentos do Firestore
    const fetchAppointments = async () => {
        if (!selectedDate) return;
        try {
            const appointmentsQuery = query(collection(db, 'appointments'), where('date', '==', selectedDate));
            const querySnapshot = await getDocs(appointmentsQuery);
            const fetchedAppointments = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAppointments(fetchedAppointments);

            // Obter horários já reservados para o dia selecionado
            const times = fetchedAppointments.map(item => item.time);
            setBookedTimes(times);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    // Função para cancelar um agendamento
    const handleCancel = async (appointmentId) => {
        try {
            await deleteDoc(doc(db, 'appointments', appointmentId));
            Alert.alert('Agendamento cancelado!');
            fetchAppointments(); // Atualiza a lista após cancelamento
        } catch (error) {
            Alert.alert('Erro ao cancelar o agendamento', error.message);
        }
    };

    // Atualiza os agendamentos ao selecionar uma nova data
    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendar Serviço</Text>

            <Text>Nome:</Text>
            <TextInput
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <Text>Serviço:</Text>
            <TextInput
                placeholder="Serviço desejado"
                value={service}
                onChangeText={setService}
                style={styles.input}
            />

            <Text>Selecione a Data:</Text>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: 'blue' },
                }}
                style={styles.calendar}
            />

            <Text>Selecione o Horário:</Text>
            <FlatList
                data={availableTimes}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.timeSlot,
                            bookedTimes.includes(item) ? styles.booked : (selectedTime === item ? styles.selected : {})
                        ]}
                        disabled={bookedTimes.includes(item)}
                        onPress={() => setSelectedTime(item)}
                    >
                        <Text style={styles.timeText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.buttonContainer}>
                <Button title="Confirmar Agendamento" onPress={handleConfirm} />
            </View>

            <Text style={styles.subtitle}>Seus Agendamentos:</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.appointmentItem}>
                        <Text style={styles.appointmentText}>
                            {item.date} às {item.time} - {item.service}
                        </Text>
                        <Button title="Cancelar" onPress={() => handleCancel(item.id)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    calendar: {
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
    timeSlot: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    booked: {
        backgroundColor: '#d3d3d3',
    },
    selected: {
        backgroundColor: '#add8e6',
    },
    timeText: {
        fontSize: 16,
    },
    appointmentItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appointmentText: {
        fontSize: 16,
    },
});

export default Appointments;