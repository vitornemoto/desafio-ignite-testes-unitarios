import { Connection } from "typeorm";
import createConnection from "../../../../database"
import request from "supertest"
import { app } from "../../../../app";

let connection : Connection;

describe("Get Statement Operation", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll ( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to find a existent statement", async () => {
        const user = {
            name: "User Test Find Statement",
            email: "find.statement@test.com",
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

        const responseDeposit =  await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 150,
            description: "Deposit Statement Test",
        })
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        const responseStatement = await request(app).get(`/api/v1/statements/${responseDeposit.body.id}`)
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        expect(responseStatement.status).toBe(200);
        expect(responseStatement.body.amount).toBe("150.00");
        expect(responseStatement.body.description).toBe("Deposit Statement Test");
    });
});