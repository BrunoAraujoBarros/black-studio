import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Image, StyleSheet, FlatList, Text, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject, listAll } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase/fiirebaseconfig';
import { AntDesign } from '@expo/vector-icons';

// Escolha dos artistas disponíveis
const artists = {
  necromant: {
    name: 'Necromant.tt',
    key: 'necromant',
  },
  larispiercer: {
    name: 'Larispiercer',
    key: 'larispiercer',
  },
  leocadio: {
    name: 'Leocadio Victor',
    key: 'leocadio',
  },
};

export default function AdminPortfolio() {
  const [image, setImage] = useState(null);
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [progressPorcent, setProgressPorcent] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(artists.necromant.key);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      setIsLoading(true);
      try {
        const storageRef = ref(storage, `portfolio/${selectedArtist}`);
        const res = await listAll(storageRef);
        const items = await Promise.all(
          res.items.map(async (itemRef) => {
            const downloadURL = await getDownloadURL(itemRef);
            return {
              id: itemRef.name,
              artist: selectedArtist,
              imageUrl: downloadURL,
              imageRefPath: itemRef.fullPath,
            };
          })
        );
        setPortfolioItems(items);
      } catch (error) {
        console.error('Erro ao buscar itens do portfólio: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [selectedArtist]);

  // Selecionar imagem da galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1, // Reduzindo a qualidade para testar upload mais rápido
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Fazer o upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    if (!image) {
      setUploadMessage('Por favor, selecione uma imagem antes de fazer o upload.');
      return;
    }

    setIsUploading(true); // Começa o indicador de carregamento
    setUploadMessage(''); // Limpa qualquer mensagem antiga

    try {
      console.log('Iniciando o upload da imagem...');

      const fileName = `portfolio/${selectedArtist}/${new Date().getTime()}.jpg`;
      const storageRef = ref(storage, fileName);
      let imgBlob;

      // Converter a imagem em blob e verificar erros
      try {
        console.log('Convertendo imagem em blob...');
        imgBlob = await (await fetch(image)).blob();
        console.log('Imagem convertida com sucesso.');
      } catch (error) {
        console.error('Erro ao converter imagem em blob: ', error);
        setUploadMessage('Erro ao processar a imagem. Por favor, tente novamente.');
        setIsUploading(false);
        return;
      }

      // Fazendo o upload da imagem para o Storage usando `uploadBytesResumable`
      const uploadTask = uploadBytesResumable(storageRef, imgBlob);

      // Monitorando o progresso do upload
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Progresso do upload: ${progress}%`);
          setProgressPorcent(progress);
        },
        (error) => {
          console.error('Erro ao fazer upload da imagem: ', error);
          setUploadMessage('Erro ao fazer upload da imagem. Por favor, tente novamente.');
          setIsUploading(false);
        },
        async () => {
          // Quando o upload for concluído, obter a URL de download
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('URL de download obtida: ', downloadURL);

            // Salvando informações no Firestore
            const docRef = await addDoc(collection(db, 'portfolio'), {
              artist: selectedArtist,
              imageUrl: downloadURL,
              tipo,
              descricao,
              dataUpload: new Date(),
              imageRefPath: storageRef.fullPath, // Salvando o caminho completo no Firestore
            });

            setUploadMessage('Upload feito com sucesso!');
            console.log('Dados da imagem salvos no Firestore.');

            // Atualiza o portfólio localmente
            setPortfolioItems((prevItems) => [
              ...prevItems,
              {
                id: docRef.id,
                artist: selectedArtist,
                imageUrl: downloadURL,
                tipo,
                descricao,
                dataUpload: new Date(),
                imageRefPath: storageRef.fullPath,
              },
            ]);

            // Limpa os campos
            setImage(null);
            setTipo('');
            setDescricao('');
            setProgressPorcent(0);
          } catch (error) {
            console.error('Erro ao salvar dados no Firestore: ', error);
            setUploadMessage('Erro ao salvar informações no Firestore. Por favor, tente novamente.');
          } finally {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Erro ao fazer upload da imagem: ', error);
      setUploadMessage('Erro ao fazer upload da imagem. Por favor, tente novamente.');
      setIsUploading(false);
    }
  };

  // Função para remover a imagem do Firebase Storage e Firestore
  const handleRemoveImage = async (itemId, imageRefPath) => {
    if (!imageRefPath) {
      Alert.alert('Erro', 'Caminho da imagem inválido. Não é possível remover a imagem.');
      return;
    }

    try {
      // Primeiro, deletar a imagem do Firebase Storage
      const imageRef = ref(storage, imageRefPath);
      console.log('Referência da imagem a ser deletada:', imageRefPath);
      await deleteObject(imageRef);
      console.log('Imagem removida do Firebase Storage com sucesso.');

      // Depois, deletar o documento do Firestore
      const docRef = doc(db, 'portfolio', itemId);
      await deleteDoc(docRef);
      console.log('Documento removido do Firestore com sucesso.');

      // Atualiza o estado local para remover o item da lista
      setPortfolioItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Erro ao remover imagem do Firebase Storage ou Firestore: ', error);
      Alert.alert('Erro', 'Erro ao remover a imagem. Por favor, tente novamente.');
    }
  };

  // Função para editar os detalhes da imagem
  const handleEditImage = (item) => {
    setSelectedItemToEdit(item);
    setTipo(item.tipo);
    setDescricao(item.descricao);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedItemToEdit) {
      try {
        const docRef = doc(db, 'portfolio', selectedItemToEdit.id);
        await updateDoc(docRef, {
          tipo,
          descricao,
        });
        console.log('Dados atualizados no Firestore.');

        // Atualiza o estado local
        setPortfolioItems((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedItemToEdit.id ? { ...item, tipo, descricao } : item
          )
        );

        setEditModalVisible(false);
        setTipo('');
        setDescricao('');
        setSelectedItemToEdit(null);
      } catch (error) {
        console.error('Erro ao atualizar dados no Firestore: ', error);
        Alert.alert('Erro', 'Erro ao salvar as alterações. Por favor, tente novamente.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Selecionar Artista */}
      <View style={styles.artistSelectionBar}>
        {Object.keys(artists).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.artistButton, selectedArtist === key && styles.selectedArtistButton]}
            onPress={() => setSelectedArtist(key)}
          >
            <Text style={styles.artistButtonText}>{artists[key].name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Escolher Imagem" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TextInput
        placeholder="Tipo de tatuagem"
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />

      {isUploading && (
        <>
          <ActivityIndicator size="large" color="#0000ff" style={styles.indicator} />
          <Text style={styles.uploadProgress}>{progressPorcent}%</Text>
        </>
      )}

      {uploadMessage !== '' && (
        <Text style={styles.uploadMessage}>{uploadMessage}</Text>
      )}

      <Button title="Upload de Imagem" onPress={uploadImage} />

      {isLoading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={portfolioItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.portfolioItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.imagePreview} />
              <Text>Tipo: {item.tipo}</Text>
              <Text>Descrição: {item.descricao}</Text>
              <Text>Artista: {artists[item.artist]?.name}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleEditImage(item)}
                  style={styles.editButton}
                >
                  <AntDesign name="edit" size={24} color="blue" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveImage(item.id, item.imageRefPath)}
                  style={styles.removeButton}
                >
                  <AntDesign name="delete" size={24} color="red" />
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal para edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
          setSelectedItemToEdit(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Imagem</Text>
            <TextInput
              placeholder="Tipo de tatuagem"
              value={tipo}
              onChangeText={setTipo}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Salvar" onPress={handleSaveEdit} />
              <Button
                title="Cancelar"
                onPress={() => {
                  setEditModalVisible(false);
                  setSelectedItemToEdit(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  artistSelectionBar: {
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  artistButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
  selectedArtistButton: {
    backgroundColor: '#000',
  },
  artistButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1, // Mantém a proporção original da imagem
    marginTop: 10,
    marginBottom: 10,
    resizeMode: 'contain', // Garante que a imagem seja exibida inteira sem ser cortada
  },
  input: {
    marginTop: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  indicator: {
    marginVertical: 20,
  },
  uploadProgress: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  uploadMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: 'green',
  },
  portfolioItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cce5ff',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'blue',
    marginLeft: 10,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'red',
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});