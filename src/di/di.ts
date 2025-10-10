import { Container } from 'inversify'
import 'reflect-metadata'
import { App } from '../app'
import { Income } from '../application/domain/model/income'
import { IIncomeRepository } from '../application/port/income.repository.interface'
import { IIncomeService } from '../application/port/income.service.interface'
import { IncomeService } from '../application/service/income.service'
import { BackgroundService } from '../background/background.service'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IncomeRepoModel } from '../infrastructure/database/schema/income.schema'
import { IncomeEntityMapper } from '../infrastructure/entity/mapper/income.entity.mapper'
import { IncomeEntity } from '../infrastructure/entity/income.entity'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IncomeRepository } from '../infrastructure/repository/income.repository'
import { IncomesController } from '../ui/controllers/incomes.controller'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { Identifier } from './identifiers'

class IoC {
    private readonly _container: Container

    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    get container(): Container {
        return this._container
    }

    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<IncomesController>(Identifier.INCOMES_CONTROLLER).to(IncomesController).inSingletonScope()

        // Services
        this._container.bind<IIncomeService>(Identifier.INCOMES_SERVICE).to(IncomeService).inSingletonScope()

        // Repositories
        this._container
            .bind<IIncomeRepository>(Identifier.INCOME_REPOSITORY)
            .to(IncomeRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.INCOME_REPO_MODEL).toConstantValue(IncomeRepoModel)

        // Mappers
        this._container
            .bind<IEntityMapper<Income, IncomeEntity>>(Identifier.INCOME_ENTITY_MAPPER)
            .to(IncomeEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
