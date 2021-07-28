import { app } from "../../../../app";
import request from "supertest"
import { Connection} from "typeorm";
import createConnection from "../../../../database"
let connection: Connection;

describe("Create Statement", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new deposit", async () => {
        const user = {
            name: "User Test Controller Deposit",
            email: "usertestcontroller@rockeatseat.com.br",
            password: "1234",
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


        const response = await request(app)
        .post("/api/v1/statements/deposit")
        .send({ amount: 10,
                description: "deposit test"} )
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toBe(10);
        expect(response.body.description).toBe("deposit test");

    });


    it("should be able to create a new withdraw", async () => {
        const user = {
            name: "User Test Controller Withdraw",
            email: "usertestcontroller@rockeatseat.com.br",
            password: "1234",
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


        const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({ amount: 5,
                description: "withdraw test"} )
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toBe(5);
        expect(response.body.description).toBe("withdraw test");

    });


    it("should not be able to create a new withdraw with insufficient funds.", async () => {
        const user = {
            name: "User Test Controller Withdraw",
            email: "usertestcontroller@rockeatseat.com.br",
            password: "1234",
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


        const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({ amount: 7,
                description: "withdraw test"} )
        .set({
            Authorization: `Bearer ${responseToken.body.token}`
        });


        expect(response.status).toBe(400);

    });


});