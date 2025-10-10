import { IService } from './service.interface'
import { Income } from '../domain/model/income'
import { IQuery } from './query.interface'


export interface IIncomeService extends IService<Income> {
    getIncomeById(expenseId: string, query: IQuery): Promise<Income | undefined>
}
