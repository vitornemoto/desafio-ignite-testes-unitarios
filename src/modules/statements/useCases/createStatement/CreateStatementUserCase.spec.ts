import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let createUserUseCase : CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    } );

    it("should be able to create a new deposit with a existent user", async() => {
        const user = await createUserUseCase.execute({
            name: "User Test Statement" ,
            email: "test@statement.com.br",
            password: "1234",
        });
    
        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.DEPOSIT ,
            amount: 10,
            description: "Test Deposit 1"
        });
    
        expect(statement).toHaveProperty("id");
        expect(statement.amount).toEqual(10);
    });

    it("should be able to create a new withdraw with a existent user and sufficient funds.", async() => {
        const user = await createUserUseCase.execute({
            name: "User Test Statement" ,
            email: "test@statement.com.br",
            password: "1234",
        });

        await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.DEPOSIT ,
            amount: 10,
            description: "Test Deposit 1"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.WITHDRAW ,
            amount: 3,
            description: "Test WithDraw 1"
        });

        expect(statement).toHaveProperty("id");
        expect(statement.amount).toEqual(3);
    });

    it("should not be able to create a new withdraw with insufficient funds.", async() => {
        
        expect(async () => {
            
            const user = await createUserUseCase.execute({
                name: "User Test Statement" ,
                email: "test@statement.com.br",
                password: "1234",
            });
    
            const statement = await createStatementUseCase.execute({
                user_id: user.id,
                type: OperationType.WITHDRAW ,
                amount: 3,
                description: "Test WithDraw 1"
            });
        
        }).rejects.toBeInstanceOf(AppError);

    })

});
