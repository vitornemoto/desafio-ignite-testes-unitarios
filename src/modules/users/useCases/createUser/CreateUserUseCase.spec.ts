import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create a new User", async () => {
        const user = await createUserUseCase.execute({
            name: "User Teste",
            email: "usertest@rockeatseat.com.br",
            password: "1234"
        });

       expect(user).toHaveProperty("id");
    });

    it("should not be able to create a new user with the same email", () => {
        expect( async () => {
            const user = {
                name: "User Teste",
                email: "usertest@rockeatseat.com.br",
                password: "1234"
            };

            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password:user.password,
            });

            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password:user.password,
            });

          }).rejects.toBeInstanceOf(AppError);
    })
});