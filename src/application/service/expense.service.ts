import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { Expense } from '../domain/model/expense'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IQuery } from '../port/query.interface'
import { IExpenseRepository } from '../port/expense.repository.interface'
import { IExpenseService } from '../port/expense.service.interface'
import { Strings } from '../../utils/strings'
import { CreateExpenseValidator } from '../domain/validator/create.expense.validator'
import { ValidationException } from '../../application/domain/exception/validation.exception'
import { UpdateExpenseValidator } from '../../application/domain/validator/update.expense.valdiator'


@injectable()
export class ExpenseService implements IExpenseService {
    constructor(
        @inject(Identifier.EXPENSE_REPOSITORY) private readonly _expenseRepository: IExpenseRepository,
    ) {
    }

    add(item: Expense): Promise<Expense | undefined> {
        throw new Error('Method not implemented.')
    }

    getAll(query: IQuery): Promise<Expense[]> {
        try {
            return this._expenseRepository.find(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    getById(id: string, query: IQuery): Promise<Expense | undefined> {
        try {
            ObjectIdValidator.validate(id);
            query.addFilter({ _id: id })
            return this._expenseRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: Expense): Promise<Expense | undefined> {
        try {
            UpdateExpenseValidator.validate(item)

            const expenseExists: boolean | undefined = await this.checkUserExpenseExists(item.userId!, item.id!);
            if (!expenseExists) return Promise.resolve(undefined)

            return this._expenseRepository.update(item)
        } catch (err) {
            return Promise.reject(err);
        }
    }

    remove(id: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    count(query: IQuery): Promise<number> {
        try {
            return this._expenseRepository.count(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addExpense(item: Expense, userId: string): Promise<Expense | undefined> {
        try {
            item.userId = userId
            CreateExpenseValidator.validate(item)
            const result: Expense | undefined = await this._expenseRepository.create(item)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllExpensesByUser(query: IQuery): Promise<Array<any>> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
            const expenses: Array<any> = await this._expenseRepository.find(query)
            return Promise.resolve(expenses)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getExpenseById(expenseId: string, query: IQuery): Promise<Expense | undefined> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
            ObjectIdValidator.validate(expenseId);
            query.addFilter({ _id: expenseId })
            return this._expenseRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeExpense(userId: string, expenseId: string): Promise<boolean | undefined> {
        try {
            const expenseExists: boolean | undefined = await this.checkUserExpenseExists(userId, expenseId);
            if (!expenseExists) return Promise.resolve(undefined)

            return this._expenseRepository.delete(expenseId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeManyExpenses(expenseIds: Array<string>, userId: string): Promise<void> {
        try {
            expenseIds.forEach(id => ObjectIdValidator.validate(id, Strings.EXPENSE.PARAM_ID_NOT_VALID_FORMAT))
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);

            return await this._expenseRepository.deleteManyExpenses(expenseIds, userId);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async checkUserExpenseExists(userId: string, expenseId: string): Promise<boolean | undefined> {
        try {
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
            ObjectIdValidator.validate(expenseId, Strings.EXPENSE.PARAM_ID_NOT_VALID_FORMAT);

            const checkUserExpenseExists: boolean | undefined =
                await this._expenseRepository.checkUserExpenseExists(userId, expenseId);

            if (!checkUserExpenseExists) {
                throw new ValidationException(
                    Strings.EXPENSE.NOT_FOUND,
                    Strings.EXPENSE.NOT_FOUND_DESCRIPTION
                )
            }

            return checkUserExpenseExists
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
