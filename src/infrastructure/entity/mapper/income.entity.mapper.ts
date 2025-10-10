import { injectable } from 'inversify'
import { Income } from '../../../application/domain/model/income'
import { IncomeEntity } from '../income.entity'
import { IEntityMapper } from '../../port/entity.mapper.interface'

@injectable()
export class IncomeEntityMapper implements IEntityMapper<Income, IncomeEntity> {
    public transform(item: any): any {
        if (item instanceof Income) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    public modelToModelEntity(item: Income): IncomeEntity {
        const result: IncomeEntity = new IncomeEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.title !== undefined) result.title = item.title
        if (item.description !== undefined) result.description = item.description
        if (item.amount !== undefined) result.amount = item.amount
        if (item.date !== undefined) result.date = item.date
        if (item.categoryId !== undefined) result.categoryId = item.categoryId
        if (item.userId !== undefined) result.userId = item.userId

        return result
    }

    public jsonToModel(json: any): Income {
        const result: Income = new Income()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        else result.id = json._id
        if (json.title !== undefined) result.title = json.title
        if (json.description !== undefined) result.description = json.description
        if (json.amount !== undefined) result.amount = json.amount
        if (json.date !== undefined) result.date = json.date
        if (json.categoryId !== undefined) result.categoryId = json.categoryId
        if (json.userId !== undefined) result.userId = json.userId
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.updated_at !== undefined) result.updated_at = json.updated_at

        return result
    }
}
