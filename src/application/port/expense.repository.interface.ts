import { IRepository } from './repository.interface'
import { Expense } from '../domain/model/expense'


export interface IExpenseRepository extends IRepository<Expense> {
    findOneById(_id: string): Promise<Expense | undefined>

    deleteManyExpenses(expenseIds: Array<string>, userId: string): Promise<void>

    checkUserExpenseExists(userId: string, expenseId: string): Promise<boolean | undefined>
}
