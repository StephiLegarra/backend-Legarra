import chai from 'chai';  
import supertest from 'supertest'; 
//import { generateMockProduct } from '../src/moking/utils.moking.js';

const expect = chai.expect; 
const requester = supertest("http://localhost:8080");  


describe("Testing PokeShop App", () => {

        describe("Testing Products Api", () => {
          /*    it("Crear Prodcuto: El API POST /api/products debe crear un nuevo producto correctamente", async ()=>{
                const productMock = generateMockProduct();
                const {
                    statusCode,
                    _body
                } = await requester.post('/api/products').send(productMock);  
                expect(statusCode).is.eqls(200); 
                expect(_body).to.have.property('status').that.eqls('ok');
                expect(_body).to.have.property('message').that.eqls('El Producto se agregó correctamente!');
            });
          //Si se crea una mascota sin el campo nombre    
            it("Crear Mascota sin nombre: El API POST /api/pets debe retornar un estado HTTP 400 con error.", async ()=>{
                //Given: creamos el mock sin nombre
                const petMock = {
                    specie: "pez",
                    birthDate: "10-10-2022"
                };
                //Then:
                const {
                    statusCode,
                    ok,
                    _body
                } = await requester.post('/api/pets').send(petMock);
                //Assert that:
                expect(statusCode).is.eqls(400);  //que el error sea 400
                expect(_body).is.ok.and.to.have.property('error'); //retorne la propiedad error
                expect(_body).to.have.property('status').and.to.be.deep.equal('error'); //si el status es error
            });
            it("Crear mascota con Avatar (Test con uploads): Debe poder crearse una mascota con la ruta de la imagen.", async ()=>{
                //Given:
                const petMock = {
                    name: "Orejitas",
                    specie: "cat",
                    birthDate: "10-11-2022"
                };
    
                //Then:
                const result = await requester.post("/api/pets/withimage")
                    .field('name', petMock.name)
                    .field('specie', petMock.specie)
                    .field('birthDate', petMock.birthDate)
                    .attach('image', './test/files/coderDog.jpg');
                //Assert that:
                expect(result.statusCode).to.eql(200);
                console.log(result._body);
                expect(result._body.payload.image).to.be.ok;
            }); */
        }); 
    //UN NUEVO ESCENARIO PARA VER EL LOGIN - SI DEVUELVE UNA COOKIE
        describe("Testing login and session with Cookies:", ()=>{
            before(function(){
                this.cookie;
                this.mockUser = {
                    first_name: "Usuario de prueba 5",
                    last_name: "Apellido de prueba 5",
                    email : "correodeprueba5@gmail.com", 
                    age: "35",
                    password : "123456"
                };
            });
            it("Test Registro Usuario: Debe poder registrar correctamente un usuario", async function(){
                console.log(this.mockUser);  
                const {
                    statusCode,
                    ok,
                    _body
                } = await requester.post('/api/sessions/register').send(this.mockUser);
                console.log(statusCode);
                console.log(_body);
                expect(statusCode).is.equal(200); 
            });
            it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function(){
                const mockLogin = {
                    email: this.mockUser.email,
                    password: this.mockUser.password
                };
                const result = (await requester.post("/api/sessions/login").send(mockLogin)); 
                const cookieResult = result.headers['set-cookie'][0]; 
                console.log(cookieResult); 
                expect(result.statusCode).is.equal(200); 
                const cookieData = cookieResult.split('='); 
                this.cookie = {
                    name: cookieData[0],
                    value: cookieData[1]
                };
                expect(this.cookie.name).to.be.ok.and.eql('coderCookieToken');
                expect(this.cookie.value).to.be.ok 
            });
            it("Test Ruta Protegida: Debe enviar la cookie que contiene el usuario y destructurarlo correctamente.", async function () {
                const response = await requester.get("/api/sessions/current").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]);
            
             if (response.status === 200) {
             expect(response.body).to.have.property('status').that.eqls('ok');
             expect(response.body).to.have.property('payload').that.is.an('object');
             expect(response.body.payload).to.have.property('email').that.eqls(this.mockUser.email);
             } else if (response.status === 401) {
             expect(response.body).to.have.property('status').that.eqls('error');
             } else {
            console.log("Código de estado no manejado:", response.status);
             }
            });
        });
    });