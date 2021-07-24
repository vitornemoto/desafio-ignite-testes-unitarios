import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get User Balance ", () => {
    beforeEach(() => {
        statementsRepositoryInMemory =  new InMemoryStatementsRepository();
        usersRepositoryInMemory =  new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory );
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
    });

    it("Should be able to get user balance with correct value.", async () => {
        const user = await createUserUseCase.execute({
            name: "Teste Balance",
            email: "teste@balance.com.br",
            password: "1234",
        });

        await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.DEPOSIT ,
            amount: 95,
            description: "Test Deposit 1"
        });

        await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.WITHDRAW ,
            amount: 40,
            description: "Test WithDraw 1"
        });

        const balance = await getBalanceUseCase.execute({
            user_id: user.id,
        });

        expect(balance.balance).toEqual(55);
        expect(balance.statement.length).toEqual(2);
    })
});
