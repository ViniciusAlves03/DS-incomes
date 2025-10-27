import { inject, injectable } from 'inversify'
import { parse } from 'qs'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Income } from '../../application/domain/model/income'
// import { IIncomeRepository } from '../../application/port/income.repository.interface'
import { IIncomeService } from '../../application/port/income.service.interface'


@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        // @inject(Identifier.INCOME_REPOSITORY) private readonly _incomeRepository: IIncomeRepository,
        @inject(Identifier.INCOME_SERVICE) private readonly _incomeService: IIncomeService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeServer()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        this._eventBus
            .provideResource('incomes.findbyuserid', async (userId: string, _query?: string) => {
                try {
                    this._logger.info(`INCOMES RPC: Query string recebida: ${_query}`);
                    const query: IQuery = this.buildQS(_query)
                    query.addFilter({ userId: userId });
                    const incomes: Array<Income> = await this._incomeService.getAllIncomesByUser(query)
                    return incomes.map(item => item.toJSON())
                } catch (err: any) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource incomes.findbyuserid successful registered'))
            .catch((err) => this._logger.error(`Error at register resource incomes.findbyuserid: ${err.message}`))
    }

    private buildQS(query?: string): IQuery {
        const parsedParams = parse(query || '', {
            ignoreQueryPrefix: true,
            allowPrototypes: true
        });

        const page = parsedParams.page ? Number(parsedParams.page as string) : 1;
        const limit = parsedParams.limit ? Number(parsedParams.limit as string) : Number.MAX_SAFE_INTEGER;

        delete parsedParams.page;
        delete parsedParams.limit;

        const finalQueryObject: any = {
            filters: parsedParams,
            pagination: {
                page: page,
                limit: limit
            }
        };

        return new Query().fromJSON(finalQueryObject);
    }
}
