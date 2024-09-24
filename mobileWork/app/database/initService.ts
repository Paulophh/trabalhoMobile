import { useSQLiteContext } from "expo-sqlite";

export type Tamagotchi = {
  id: number,
  name: string,
  status: number,
  hunger: number,
  happiness: number,
  energy: number,
  
}

export function useTodoDatabase() {
  const database = useSQLiteContext();


  async function createTamagotchi({ name, imageUrl }: { name: string; imageUrl: string }) {
    try {
      const query = await database.prepareAsync(`
        INSERT INTO Tamagotchi (name, happiness, hunger, energy, status, imageUrl)
        VALUES ($name, $happiness, $hunger, $energy, $status, $imageUrl);
      `);

      await query.executeAsync({
        $name: name,
        $happiness: 100,
        $hunger: 100,
        $energy: 100,
        $status: 300,
        $imageUrl: imageUrl,
      });

      console.log('Tamagotchi criado com sucesso!');
    } catch (error) {
      console.log('Erro ao criar Tamagotchi:', error);
    }
  }


  async function getTamagotchi() {
    try {
      const response = await database.getAllAsync<any>('SELECT * FROM Tamagotchi');
      console.log(response);
      return response;
    } catch (error) {
      console.error('Erro ao buscar os Tamagotchis:', error);
      throw error;
    }
  }

  
  const getTamagotchiById = async (id: number) => {
    try {
      const response = await database.getAllAsync<any>('SELECT * FROM Tamagotchi WHERE ID = ?', [id]);
      return response; 
    } catch (error) {
      console.error(`Erro ao buscar Tamagotchi pelo ID ${id}:`, error);
      throw error;
    }
  };

  async function updateTamagotchiAttributes(data: Omit<Tamagotchi, "name">) {
    const query = await database.prepareAsync(
        `UPDATE Tamagotchi 
         SET hunger = $hunger, happiness = $happiness, energy = $energy, status = $status 
         WHERE id = $id;`
    );
    try {
        await query.executeAsync({
            $hunger: data.hunger,
            $happiness: data.happiness,
            $energy: data.energy,
            $status: data.status, 
            $id: data.id, 
        });
        console.log(`Tamagotchi ${data.id} atualizado com sucesso!`);
    } catch (error) {
        console.error("Erro ao atualizar Tamagotchi:", error);
        throw error;
    } finally {
        query.finalizeAsync();
    }
}
  

  async function decreaseTimeTamagotchiAttributes() {
    try {
      await database.execAsync(`
        UPDATE Tamagotchi
        SET hunger = hunger - 1,
            energy = energy - 1,
            happiness = happiness - 1;
      `);

      console.log("Atributos de todos os Tamagotchis foram atualizados.");
    } catch (error) {
      console.error("Erro ao atualizar atributos de todos os Tamagotchis:", error);
    }
  }

  return {
    createTamagotchi,
    getTamagotchi,
    getTamagotchiById,
    updateTamagotchiAttributes,
    decreaseTimeTamagotchiAttributes,
  };
}
