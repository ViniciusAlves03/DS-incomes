import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IIncomeService } from '../../application/port/income.service.interface'
import { ApiException } from '../../ui/exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Income } from '../../application/domain/model/income'
import { Strings } from '../../utils/strings'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'


@controller('/v1/users/:user_id/incomes')
export class UsersIncomesController {
    constructor(
        @inject(Identifier.INCOME_SERVICE) private readonly _incomeService: IIncomeService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addIncome(@request() req: Request, @response() res: Response): Promise<Response> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);

        const income: Income = new Income().fromJSON(req.body)
        const result: Income | undefined = await this._incomeService.addIncome(income, req.params.user_id)

        return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
    }

    @httpGet('/')
    public async getAllIncomes(@request() req: Request, @response() res: Response): Promise<Response> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);

        const query: IQuery = new Query().fromJSON(req.query)
        query.addFilter({ userId: req.params.user_id })
        const result: Array<Income> = await this._incomeService.getAllIncomesByUser(query)
        const count: number = await this._incomeService.count(query)

        res.setHeader('X-Total-Count', count)
        return res.status(HttpStatus.OK).send(this.toJSONView(result))
    }

    @httpGet('/:income_id')
    public async getIncomeById(@request() req: Request, @response() res: Response): Promise<Response | undefined> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
        ObjectIdValidator.validate(req.params.income_id);

        const query: IQuery = new Query().fromJSON(req.query)
        query.addFilter({ userId: req.params.user_id })
        const result: Income | undefined = await this._incomeService.getIncomeById(req.params.income_id, query)

        if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageIncomeNotFound())
        return res.status(HttpStatus.OK).send(this.toJSONView(result))
    }

    @httpPatch('/:income_id')
    public async updateIncomeUser(@request() req: Request, @response() res: Response): Promise<Response> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
        ObjectIdValidator.validate(req.params.income_id);

        const income: Income = new Income().fromJSON(req.body)
        income.id = req.params.income_id
        income.userId = req.params.user_id
        const result: Income | undefined = await this._incomeService.update(income)

        if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageIncomeNotFound())
        return res.status(HttpStatus.OK).send(result)
    }

    @httpDelete('/:income_id')
    public async removeIncomeUser(@request() req: Request, @response() res: Response): Promise<Response> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
        ObjectIdValidator.validate(req.params.income_id);

        const result = await this._incomeService.removeIncome(req.params.user_id, req.params.income_id)

        if (result === undefined) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageIncomeNotFound())
        return res.status(HttpStatus.NO_CONTENT).send()
    }

    @httpDelete('/')
    public async removeMultipleIncomes(@request() req: Request, @response() res: Response): Promise<Response> {
        ObjectIdValidator.validate(req.params.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);

        const incomeIds: Array<string> = req.body.ids
        await this._incomeService.removeManyIncomes(incomeIds, req.params.user_id);

        return res.status(HttpStatus.NO_CONTENT).send()
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
