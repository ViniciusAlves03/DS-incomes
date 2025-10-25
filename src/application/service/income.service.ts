import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { Income } from '../domain/model/income'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IQuery } from '../port/query.interface'
import { IIncomeRepository } from '../port/income.repository.interface'
import { IIncomeService } from '../port/income.service.interface'
import { CreateIncomeValidator } from '../domain/validator/create.income.validator'
import { UpdateIncomeValidator } from '../domain/validator/update.income.valdiator'
import { Strings } from '../../utils/strings'
import { ValidationException } from '../../application/domain/exception/validation.exception'


@injectable()
export class IncomeService implements IIncomeService {
    constructor(
        @inject(Identifier.INCOME_REPOSITORY) private readonly _incomeRepository: IIncomeRepository,
    ) {
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

    public async update(item: Income): Promise<Income | undefined> {
        try {
            UpdateIncomeValidator.validate(item)

            const incomeExists: boolean | undefined = await this.checkUserIncomeExists(item.userId!, item.id!);
            if (!incomeExists) return Promise.resolve(undefined)

            return this._incomeRepository.update(item)
        } catch (err) {
            return Promise.reject(err);
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

    public async getAllIncomesByUser(query: IQuery): Promise<Array<any>> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
            const incomes: Array<any> = await this._incomeRepository.find(query)
            return Promise.resolve(incomes)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getIncomeById(incomeId: string, query: IQuery): Promise<Income | undefined> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
            ObjectIdValidator.validate(incomeId);
            query.addFilter({ _id: incomeId })
            return this._incomeRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeIncome(userId: string, incomeId: string): Promise<boolean | undefined> {
        try {
            const incomeExists: boolean | undefined = await this.checkUserIncomeExists(userId, incomeId);
            if (!incomeExists) return Promise.resolve(undefined)

            return this._incomeRepository.delete(incomeId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeManyIncomes(incomeIds: Array<string>, userId: string): Promise<void> {
        try {
            incomeIds.forEach(id => ObjectIdValidator.validate(id, Strings.INCOME.PARAM_ID_NOT_VALID_FORMAT))
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);

            return await this._incomeRepository.deleteManyIncomes(incomeIds, userId);
        } catch (err) {
            return Promise.reject(err);
        }
    }


    public async checkUserIncomeExists(userId: string, incomeId: string): Promise<boolean | undefined> {
        try {
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
            ObjectIdValidator.validate(incomeId, Strings.INCOME.PARAM_ID_NOT_VALID_FORMAT);

            const checkUserIncomeExists: boolean | undefined =
                await this._incomeRepository.checkUserIncomeExists(userId, incomeId);

            if (!checkUserIncomeExists) {
                throw new ValidationException(
                    Strings.INCOME.NOT_FOUND,
                    Strings.INCOME.NOT_FOUND_DESCRIPTION
                )
            }

            return checkUserIncomeExists
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
