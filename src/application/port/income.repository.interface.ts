import { IRepository } from './repository.interface'
import { Income } from '../domain/model/income'


export interface IIncomeRepository extends IRepository<Income> {
    findOneById(_id: string): Promise<Income | undefined>

    deleteManyIncomes(incomeIds: Array<string>, userId: string): Promise<void>

    checkUserIncomeExists(userId: string, incomeId: string): Promise<boolean>
}
