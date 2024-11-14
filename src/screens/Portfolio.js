import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MasonryList from 'react-native-masonry-list';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../../firebase/fiirebaseconfig';

// Escolha dos artistas disponíveis
const artists = {
  necromant: {
    name: 'Necromant.tt',
    description: 'Sou um artista especializado em tatuagens realistas. Trago minha criatividade e técnica para oferecer um trabalho único para cada cliente.',
    imageUrl: require('../../assets/ImagensArtistas/necromant.jpg'), // Adicione a logo correta para cada artista aqui
  },
  larispiercer: {
    name: 'Larispiercer',
    description: 'Especialista em piercings, oferecendo serviços seguros e profissionais com um toque pessoal e criativo.',
    imageUrl: require('../../assets/ImagensArtistas/perfil laris piercing.jpg'),
  },
  leocadio: {
    name: 'Leocadio Victor',
    description: 'Artista tatuador que foca em designs finos e detalhados, trazendo elegância e precisão para cada obra.',
    imageUrl: require('../../assets/ImagensArtistas/Leocadio.jpg'),
  },
};
export default function Portfolio() {
  const [tattoos, setTattoos] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('necromant');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const artist = artists[selectedArtist];

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      setIsLoading(true);
      const storageRef = ref(storage, `portfolio/${selectedArtist}`);
      try {
        const res = await listAll(storageRef);
        const items = await Promise.all(
          res.items.map(async (itemRef) => {
            const downloadURL = await getDownloadURL(itemRef);
            return {
              uri: downloadURL,
              id: itemRef.name,
            };
          })
        );
        setTattoos(items);
      } catch (error) {
        console.error('Erro ao buscar itens do portfólio: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [selectedArtist]);

  return (
    <View style={styles.container}>
      {/* Barra de Seleção de Artista */}
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

      {/* Cabeçalho do Portfólio */}
      <View style={styles.header}>
        <Image source={require('../../assets/Imagem do WhatsApp de 2024-09-19 à(s) 20.23.57_eb5e31c0.jpg')} style={styles.blackStudioLogo} />
        <Image source={artist.imageUrl} style={[styles.logo, { width: 120, height: 120 }]} />
        <Text style={styles.artistName}>{artist.name}</Text>
        <Text style={styles.artistDescription}>{artist.description}</Text>
      </View>

      {/* Indicador de Carregamento */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
      ) : (
        /* Lista de Imagens do Portfólio */
        <MasonryList
          images={tattoos}
          columns={2}
          spacing={5}
          imageContainerStyle={styles.imageContainer}
          onPressImage={(image) => setSelectedImage(image.uri)}
        />
      )}

      {/* Modal para Visualização da Imagem */}
      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedImage(null)}>
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#000',
  },
  blackStudioLogo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  artistName: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  artistDescription: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});
