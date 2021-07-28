import { Connection } from "typeorm";
import request from "supertest"
import createConnection from "../../../../database"
import { app } from "../../../../app";


let connection: Connection;

describe("Show User Profile", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to show a user profile", async () => {
              
        const user = {
            name: "User Teste Controller",
            email: "usertestcontroller@rockeatseat3333.com.br",
            password: "1234"
        }
        await request(app).post("/api/v1/users").send({
            name: user.name,
            email: user.email,
            password: user.password
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: user.password,
        });


        const response = await request(app)
        .get("/api/v1/profile")
        .send({ user_id : responseToken.body.user.id} )
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toEqual("User Teste Controller");
    })
})