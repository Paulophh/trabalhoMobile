import { useTodoDatabase } from "@/app/database/initService";
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native"; 
import { useEffect, useState } from 'react';
import { useRouter } from "expo-router";

export default function ListTamagotchi() {
    type Tamagotchi = {
        ID: number;
        name: string;
        imageUrl: string;
        hunger: number;
        happiness: number;
        energy: number;
        status: number; 
    };

    const router = useRouter();
    const goNextScreen = () => {
        router.push("/tamagotchiRegister");
    };
    const playGames = () => {
        if (selectedTamagotchi && selectedTamagotchi.status === 1) {
            router.push({
                pathname: "/gameScreen",
                params: { id: selectedTamagotchi.ID },
            });
            closeModal();
        } else {
            Alert.alert("Tamagotchi está morto e não pode mais jogar.");
        }
    };

    const [data, setData] = useState<Tamagotchi[]>([]);
    const [selectedTamagotchi, setSelectedTamagotchi] = useState<Tamagotchi | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getTamagotchi, updateTamagotchiAttributes } = useTodoDatabase();

    useEffect(() => {
        const listData = async () => {
            try {
                const res = await getTamagotchi();
                console.log("Dados retornados:", res);
                setData(res);
            } catch (error) {
                console.log("Erro ao listar Tamagotchis:", error);
            }
        };

        listData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            data.forEach(async (tamagotchi) => {
                if (tamagotchi.status === 0) return; 
    
                const updatedHunger = Math.max(tamagotchi.hunger - 1, 0); 
                const updatedHappiness = Math.max(tamagotchi.happiness - 1, 0); 
                const updatedEnergy = Math.max(tamagotchi.energy - 1, 0); 
    
            
                const sumAttributes = updatedHunger + updatedHappiness + updatedEnergy;
    
                if (sumAttributes === 0) {
                    await updateTamagotchiAttributes({
                        id: tamagotchi.ID, 
                        hunger: updatedHunger,
                        happiness: updatedHappiness,
                        energy: updatedEnergy,
                        status: 0, 
                    });
                    console.log(`${tamagotchi.name} morreu!`);
                } else {
                    await updateTamagotchiAttributes({
                        id: tamagotchi.ID,
                        hunger: updatedHunger,
                        happiness: updatedHappiness,
                        energy: updatedEnergy,
                        status: tamagotchi.status, 
                    });
                }
            });
        }, 3600000); 
    
        return () => clearInterval(intervalId); 
    }, [data]);

    const openModal = (tamagotchi: Tamagotchi) => {
        setSelectedTamagotchi(tamagotchi);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTamagotchi(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecione seu Tamagotchi</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.ID.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.image}
                        />
                        <Text style={styles.name}>{item.name || "Sem nome"}</Text>
                        {item.status === 0 && <Text style={styles.deadText}>Morto</Text>}
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={goNextScreen}>
                <Text style={styles.buttonText}>Registrar Novo Tamagotchi</Text>
            </TouchableOpacity>

            {selectedTamagotchi && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: selectedTamagotchi.imageUrl }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalTitle}>{selectedTamagotchi.name || "Sem nome"}</Text>
                            <Text style={styles.modalAttribute}>Fome: {selectedTamagotchi.hunger}</Text>
                            <Text style={styles.modalAttribute}>Felicidade: {selectedTamagotchi.happiness}</Text>
                            <Text style={styles.modalAttribute}>Energia: {selectedTamagotchi.energy}</Text>
                            <Text style={styles.modalAttribute}>Status: {selectedTamagotchi.status === 1 ? "Vivo" : "Morto"}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                            {selectedTamagotchi.status === 1 && (
                                <TouchableOpacity style={styles.playButton} onPress={playGames}>
                                    <Text style={styles.closeButtonText}>Jogar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        marginTop: 15
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalAttribute: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        backgroundColor: '#ff5c5c',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    playButton: {
        backgroundColor: "#008000",
        padding:10,
        borderRadius: 5,
        marginTop:20
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deadText: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
