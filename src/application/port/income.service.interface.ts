import { IService } from './service.interface'
import { Income } from '../domain/model/income'
import { IQuery } from './query.interface'


export interface IIncomeService extends IService<Income> {
    getIncomeById(incomeId: string, query: IQuery): Promise<Income | undefined>

    getAllIncomesByUser(query: IQuery): Promise<Array<any>>

    addIncome(item: Income, userId: string): Promise<Income | undefined>
}
