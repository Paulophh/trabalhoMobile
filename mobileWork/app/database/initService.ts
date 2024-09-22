import { useSQLiteContext } from "expo-sqlite"

export function useTodoDatabase () {

    const database = useSQLiteContext()

    async function createTamagotchi({ name, imageUrl }: { name: string, imageUrl : string }) {
       
        const query = await database.prepareAsync(`
          INSERT INTO Tamagotchi (name, happiness, hunger, energy, status, imageUrl)
          VALUES ($name, $happiness, $hunger, $energy, $status, $imageUrl);
        `);
        try {
          await query.executeAsync({$name: name, $happiness: 100,  $hunger: 100, $energy: 100, $status: 1, $imageUrl: imageUrl});
        } catch (error) {
          console.log('Erro ao criar Tamagotchi:', error);
        } finally {
          await query.finalizeAsync();
        }
      }

async function getTamagotchi() {
   try {
     const response = await database.getAllAsync<any>('SELECT * FROM Tamagotchi');
     console.log(response); 
     return response; 
   } catch (error) {
     console.error('Erro os tamagotchi:', error); 
     throw error; 
   }
 }



return { createTamagotchi}
}