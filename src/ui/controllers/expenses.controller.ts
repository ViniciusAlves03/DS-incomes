import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IExpenseService } from '../../application/port/expense.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../../ui/exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Expense } from '../../application/domain/model/expense'
import { Strings } from '../../utils/strings'

@controller('/v1/expenses')
export class ExpensesController {
    constructor(
        @inject(Identifier.EXPENSE_SERVICE) private readonly _expenseService: IExpenseService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllExpenses(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            const result: Array<Expense> = await this._expenseService.getAll(query)
            const count: number = await this._expenseService.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:expense_id')
    public async getExpenseById(@request() req: Request, @response() res: Response): Promise<Response | undefined> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            const result: Expense | undefined = await this._expenseService.getById(req.params.expense_id, query)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageExpenseNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(expense: Expense | Array<Expense> | undefined): object {
        if (expense instanceof Array) return expense.map(item => this.toJSONView(item))
        return expense?.toJSON()
    }

    private getMessageExpenseNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.EXPENSE.NOT_FOUND,
            Strings.EXPENSE.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }
}
