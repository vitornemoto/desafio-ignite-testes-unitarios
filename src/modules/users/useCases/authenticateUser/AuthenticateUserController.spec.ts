import { Connection } from "typeorm";
import request from "supertest"
import createConnection from "../../../../database"
import { app } from "../../../../app";

let connection: Connection;

describe ("Authenticate User Controller", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it ("should be able to authenticate a existent email user", async () => {
        
        const user = {
            name: "User Teste Controller",
            email: "usertestcontroller222@rockeatseat.com.br",
            password: "1234",
        };
        
        await request(app).post("/api/v1/users").send({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: user.password,
        });

        expect(responseToken.body).toHaveProperty("token");
    });

});