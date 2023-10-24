class UserDTO {
    constructor(user) {
      console.log("User data before creating DTO:", user);
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.rol = user.rol;
      this.age = user.age;
    }
  }
  
  export default UserDTO;