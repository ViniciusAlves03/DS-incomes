import { Container } from 'inversify'
import 'reflect-metadata'
import { App } from '../app'
import { Income } from '../application/domain/model/income'
import { IIncomeRepository } from '../application/port/income.repository.interface'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IIncomeService } from '../application/port/income.service.interface'
import { IncomeService } from '../application/service/income.service'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { BackgroundService } from '../background/background.service'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IncomeRepoModel } from '../infrastructure/database/schema/income.schema'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { IncomeEntityMapper } from '../infrastructure/entity/mapper/income.entity.mapper'
import { IncomeEntity } from '../infrastructure/entity/income.entity'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IncomeRepository } from '../infrastructure/repository/income.repository'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IncomesController } from '../ui/controllers/incomes.controller'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { Identifier } from './identifiers'
import { UsersIncomesController } from '../ui/controllers/users.incomes.controller'


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
        this._container.bind<UsersIncomesController>(Identifier.USERS_INCOMES_CONTROLLER).to(UsersIncomesController).inSingletonScope()

        // Services
        this._container.bind<IIncomeService>(Identifier.INCOME_SERVICE).to(IncomeService).inSingletonScope()

        // Repositories
        this._container
            .bind<IIncomeRepository>(Identifier.INCOME_REPOSITORY)
            .to(IncomeRepository).inSingletonScope()
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.INCOME_REPO_MODEL).toConstantValue(IncomeRepoModel)
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)

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
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
