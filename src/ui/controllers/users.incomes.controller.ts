import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IIncomeService } from '../../application/port/income.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'
import { Income } from '../../application/domain/model/income'

@controller('/v1/users/:user_id/incomes')
export class UsersExpensesController {
    constructor(
        @inject(Identifier.INCOMES_SERVICE) private readonly _incomeService: IIncomeService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addIncome(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const income: Income = new Income().fromJSON(req.body)
            const result: Income | undefined = await this._incomeService.addIncome(income, req.params.user_id)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(income: Income | Array<Income> | undefined): object {
        if (income instanceof Array) return income.map(item => this.toJSONView(item))
        return income?.toJSON()
    }
}
