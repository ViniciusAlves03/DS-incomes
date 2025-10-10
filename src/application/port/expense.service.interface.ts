import { IService } from './service.interface'
import { Expense } from '../domain/model/expense'
import { IQuery } from './query.interface'


export interface IExpenseService extends IService<Expense> {
    addExpense(item: Expense, userId: string): Promise<Expense | undefined>

    getAllExpensesByUser(query: IQuery): Promise<Array<any>>

    getExpenseById(expenseId: string, query: IQuery): Promise<Expense | undefined>

    checkUserExpenseExists(userId: string, expenseId: string): Promise<boolean | undefined>

    removeExpense(userId: string, expenseId: string): Promise<boolean | undefined>

    removeManyExpenses(expenseIds: Array<string>, userId: string): Promise<void>
}
