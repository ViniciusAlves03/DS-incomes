import { inject, injectable } from 'inversify'
import { Expense } from '../../application/domain/model/expense'
import { Identifier } from '../../di/identifiers'
import { IExpenseRepository } from '../../application/port/expense.repository.interface'
import { ExpenseEntity } from '../entity/expense.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'
import { Query } from './query/query'
import { IQuery } from '../../application/port/query.interface'


@injectable()
export class ExpenseRepository extends BaseRepository<Expense, ExpenseEntity> implements IExpenseRepository {
    constructor(
        @inject(Identifier.EXPENSE_REPO_MODEL) protected readonly _expenseModel: any,
        @inject(Identifier.EXPENSE_ENTITY_MAPPER) protected readonly _expenseMapper: IEntityMapper<Expense, ExpenseEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_expenseModel, _expenseMapper, _logger)
    }

    public findOneById(_id: string): Promise<Expense | undefined> {
        return super.findOne(new Query().fromJSON({ filters: { _id } }))
    }

    public deleteManyExpenses(expenseIds: Array<string>, userId: string): Promise<void> {
        const query: IQuery = new Query().fromJSON({
            filters: {
                _id: { $in: expenseIds },
                userId: userId
            }
        });
        return super.deleteMany(query);
    }

    public checkUserExpenseExists(userId: string, expenseId: string): Promise<boolean> {
        const query: IQuery = new Query().fromJSON({
            filters: { _id: expenseId, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            super.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }
}
