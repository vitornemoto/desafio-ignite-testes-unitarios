import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe ("Show Profile", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to show a profile with existent user", async () => {
       
        const user = await createUserUseCase.execute({
            name: "Test Profile",
            email: "test@profile.com.br",
            password: "1234"
        });

        const userProfile = await showUserProfileUseCase.execute(user.id);
        
        expect(userProfile).toEqual(user);

    });
});