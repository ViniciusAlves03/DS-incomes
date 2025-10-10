import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { Income } from '../domain/model/income'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IQuery } from '../port/query.interface'
import { IIncomeRepository } from '../port/income.repository.interface'
import { IIncomeService } from '../port/income.service.interface'
import { CreateIncomeValidator } from '../domain/validator/create.income.validator'


@injectable()
export class IncomeService implements IIncomeService {
    constructor(
        @inject(Identifier.INCOME_REPOSITORY) private readonly _incomeRepository: IIncomeRepository,
    ) {
    }

    update(item: Income): Promise<Income | undefined> {
        throw new Error('Method not implemented.')
    }

    add(item: Income): Promise<Income | undefined> {
        throw new Error('Method not implemented.')
    }

    getAll(query: IQuery): Promise<Income[]> {
        try {
            return this._incomeRepository.find(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    getById(id: string, query: IQuery): Promise<Income | undefined> {
        try {
            ObjectIdValidator.validate(id);
            query.addFilter({ _id: id })
            return this._incomeRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    remove(id: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    count(query: IQuery): Promise<number> {
        try {
            return this._incomeRepository.count(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addIncome(item: Income, userId: string): Promise<Income | undefined> {
        try {
            item.userId = userId
            CreateIncomeValidator.validate(item)
            const result: Income | undefined = await this._incomeRepository.create(item)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getIncomeById(expenseId: string, query: IQuery): Promise<Income | undefined> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
            ObjectIdValidator.validate(expenseId);
            query.addFilter({ _id: expenseId })
            return this._incomeRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
