import { ValidationException } from '../exception/validation.exception'
import { Income } from '../model/income'
import { Strings } from '../../../utils/strings'
import { DateValidator } from './date.validator'
import { ObjectIdValidator } from './object.id.validator'

export class CreateIncomeValidator {
    public static validate(item: Income): void | ValidationException {
        const fields: Array<string> = []

        if (item.id) ObjectIdValidator.validate(item.id)
        if (item.userId) ObjectIdValidator.validate(item.userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
        if (item.categoryId) ObjectIdValidator.validate(item.categoryId, Strings.CATEGORY.PARAM_ID_NOT_VALID_FORMAT);

        if (!item.title) fields.push('title')
        if (!item.amount) fields.push('amount')
        if (!item.userId) fields.push('userId')

        if (item.date) DateValidator.validate(item.date)

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Income validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
