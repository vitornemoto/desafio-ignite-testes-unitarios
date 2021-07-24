import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { rejects } from "node:assert";


let authenticateUserUseCase : AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User", () => {
    beforeEach( () => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User Teste",
            email: "usertest@rockeatseat.com.br",
            password: "1234"
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a non existent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "wrongemail@teste.com",
                password: "1234",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "User Teste",
                email: "usertest@rockeatseat.com.br",
                password: "1234"
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPassowrd",
            });
        }).rejects.toBeInstanceOf(AppError);
    })
});