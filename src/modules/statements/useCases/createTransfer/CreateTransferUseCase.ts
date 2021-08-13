import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ){}

    async execute ({ user_id, type, amount, description, sender_id }: ICreateTransferDTO){
        const user = await this.usersRepository.findById(user_id);

        if(!user_id){
            throw new AppError("User not found!", 404);
        }

        const sender = await this.usersRepository.findById(String(sender_id));

        if(!sender){
            throw new AppError("User not found!", 404);
        }
        
        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });
      
        if (balance < amount) {
            throw new AppError("Insufficient Funds!");
        }

        const statementOperation = await this.statementsRepository.create({
            user_id,
            type,
            amount,
            description,
            sender_id
          });
      
          return statementOperation;
        

    }
}

export { CreateTransferUseCase }