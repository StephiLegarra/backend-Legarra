class UserManagerFS {
    constructor(){
        this.users = []
        this.path = "./Users.json";
    }

    async initialize() {
        try {
          await fs.access(this.path); 
          const users = await fs.readFile(this.path, "utf-8");
          const userParse = JSON.parse(users);
    
          if (userParse.length !== 0) {
            const usersParse = await this.getUsersGeneral();
            this.users = usersParse;
          } else {
            await this.createFile();
          }
        } catch (err) {
          await this.createFile();
        }
      }

    async createFile() {
        try {
          await fs.writeFile(this.path, JSON.stringify(this.users, null, 2));
        } catch (err) {
          console.log(err.message);
        }
      }
    
    async getUsersGeneral(){
        try {
            const getUsers = await fs.readFile(this.path, "utf-8");
            const getUsersParse = JSON.parse(getUsers);
            return getUsersParse;
        } catch (err) {
            console.log(err.message);
        }
    }  

    async getUsers() {
        try {
            const users = await this.getUsersGeneral();
            console.log(users);
        } catch(err) {
           console.log(err.message);
        }  
    }

    async addUser (first_name, last_name, email, age, password) {
        try {
            const {first_name, last_name, email, age, password} = user;
            const emailExists = this.users.some((item) => item.email === email);
            if (emailExists) {
                return console.log("El mail ingresado ya existe!");
            }

            if (!first_name || !last_name || !email || !age || !password) {
                return console.log("Falta ingresar un campo obligatorio");
            }
            this.users.push(user);
            await this.createFile();
        } catch (err) {
            console.log(err.message);
          }
       
    }

    async editUser (email, user){
        try {
        const index = this.users.findIndex((item) => item.email === email);
        if (index === -1) {
            return console.log("No se encontró el usuario");
        }
        this.users[index] = user;
        await this.createFile();
        return this.users[index];
        } catch (err) {
            console.log(err.message);
        }
    }

    async deleteUser(email){
        try {
            const readParse = await this.getUsersGeneral();
            const deleteUser = readParse.filter((item) => item.email !== email);
            await fs.writeFile(this.path, JSON.stringify(deleteUser, null, 2));
        } catch (err) {
            console.log(err.message);
        }
    }
}

export default UserManagerFS;