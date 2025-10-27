import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IIncomeService } from '../../application/port/income.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../../ui/exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Income } from '../../application/domain/model/income'
import { Strings } from '../../utils/strings'

@controller('/v1/users/:user_id/incomes')
export class UsersIncomesController {
    constructor(
        @inject(Identifier.INCOME_SERVICE) private readonly _incomeService: IIncomeService,
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

    @httpGet('/')
    public async getAllIncomes(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ userId: req.params.user_id })
            const result: Array<Income> = await this._incomeService.getAllIncomesByUser(query)
            const count: number = await this._incomeService.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:income_id')
    public async getIncomeById(@request() req: Request, @response() res: Response): Promise<Response | undefined> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ userId: req.params.user_id })
            const result: Income | undefined = await this._incomeService.getIncomeById(req.params.income_id, query)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageIncomeNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:income_id')
    public async updateIncomeUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const income: Income = new Income().fromJSON(req.body)
            income.id = req.params.income_id
            income.userId = req.params.user_id
            const result: Income | undefined = await this._incomeService.update(income)
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpDelete('/:income_id')
    public async removeIncomeUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._incomeService.removeIncome(req.params.user_id, req.params.income_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpDelete('/')
    public async removeMultipleIncomes(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const incomeIds: Array<string> = req.body.ids
            await this._incomeService.removeManyIncomes(incomeIds, req.params.user_id);
            return res.status(HttpStatus.NO_CONTENT).send()
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

    private getMessageIncomeNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.INCOME.NOT_FOUND,
            Strings.INCOME.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }
}
