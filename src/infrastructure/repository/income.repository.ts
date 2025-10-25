import { inject, injectable } from 'inversify'
import { Income } from '../../application/domain/model/income'
import { Identifier } from '../../di/identifiers'
import { IIncomeRepository } from '../../application/port/income.repository.interface'
import { IncomeEntity } from '../entity/income.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'
import { Query } from './query/query'
import { IQuery } from '../../application/port/query.interface'


@injectable()
export class IncomeRepository extends BaseRepository<Income, IncomeEntity> implements IIncomeRepository {
    constructor(
        @inject(Identifier.INCOME_REPO_MODEL) protected readonly _incomeModel: any,
        @inject(Identifier.INCOME_ENTITY_MAPPER) protected readonly _incomeMapper: IEntityMapper<Income, IncomeEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_incomeModel, _incomeMapper, _logger)
    }

    public findOneById(_id: string): Promise<Income | undefined> {
        return super.findOne(new Query().fromJSON({ filters: { _id } }))
    }

    public deleteManyIncomes(incomeIds: Array<string>, userId: string): Promise<void> {
        const query: IQuery = new Query().fromJSON({
            filters: {
                _id: { $in: incomeIds },
                userId: userId
            }
        });
        return super.deleteMany(query);
    }

    public checkUserIncomeExists(userId: string, incomeId: string): Promise<boolean> {
        const query: IQuery = new Query().fromJSON({
            filters: { _id: incomeId, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            super.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }
}
