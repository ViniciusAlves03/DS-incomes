import { IService } from './service.interface'
import { Income } from '../domain/model/income'
import { IQuery } from './query.interface'


export interface IIncomeService extends IService<Income> {
    addIncome(item: Income, userId: string): Promise<Income | undefined>

    getIncomeById(incomeId: string, query: IQuery): Promise<Income | undefined>

    getAllIncomesByUser(query: IQuery): Promise<Array<any>>

    removeIncome(userId: string, incomeId: string): Promise<boolean | undefined>

    checkUserIncomeExists(userId: string, incomeId: string): Promise<boolean | undefined>
}
