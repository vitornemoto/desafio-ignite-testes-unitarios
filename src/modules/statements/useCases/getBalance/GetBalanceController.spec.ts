import { Connection, createConnection } from "typeorm";
import request from "supertest"
import { app } from "../../../../app";

let connection: Connection;

describe("Get User Balance", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to user balance with correct value.", async () => {
        const user = {
            name: "Test Balance Controller",
            email: "testebalance@controller.com.br",
            password: "1234"
        }

        await request(app).post("/api/v1/users").send({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: user.password, 
        });


        await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 10,
            description: "Deposit Test"
        })
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 3,
            description: "withdraw Test"
        })
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        const response = await request(app).get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        
        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(7);
        

    })
});