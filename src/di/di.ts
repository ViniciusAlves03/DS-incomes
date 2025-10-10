import { Container } from 'inversify'
import 'reflect-metadata'
import { App } from '../app'
import { Expense } from '../application/domain/model/expense'
import { IExpenseRepository } from '../application/port/expense.repository.interface'
import { IExpenseService } from '../application/port/expense.service.interface'
import { ExpenseService } from '../application/service/expense.service'
import { BackgroundService } from '../background/background.service'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { ExpenseRepoModel } from '../infrastructure/database/schema/expense.schema'
import { ExpenseEntityMapper } from '../infrastructure/entity/mapper/expense.entity.mapper'
import { ExpenseEntity } from '../infrastructure/entity/expense.entity'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { ExpenseRepository } from '../infrastructure/repository/expense.repository'
import { ExpensesController } from '../ui/controllers/expenses.controller'
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
        this._container.bind<ExpensesController>(Identifier.EXPENSES_CONTROLLER).to(ExpensesController).inSingletonScope()

        // Services
        this._container.bind<IExpenseService>(Identifier.EXPENSE_SERVICE).to(ExpenseService).inSingletonScope()

        // Repositories
        this._container
            .bind<IExpenseRepository>(Identifier.EXPENSE_REPOSITORY)
            .to(ExpenseRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.EXPENSE_REPO_MODEL).toConstantValue(ExpenseRepoModel)

        // Mappers
        this._container
            .bind<IEntityMapper<Expense, ExpenseEntity>>(Identifier.EXPENSE_ENTITY_MAPPER)
            .to(ExpenseEntityMapper).inSingletonScope()

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
