import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

interface IRequest {
    user_id: string;
    statement_id: string;
  }
describe("Get Statement Operation", () => {
    beforeEach(() => {
        statementsRepositoryInMemory =  new InMemoryStatementsRepository();
        usersRepositoryInMemory =  new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory );
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory );
    });

    it("Should able to find an existent statement.", async () => {
        
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

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: statement.id,
        } as IRequest);

        expect(statementOperation.id).toEqual(statement.id);
        expect(statement.user_id).toEqual(user.id);
        expect(statement.amount).toEqual(10);
    });


});