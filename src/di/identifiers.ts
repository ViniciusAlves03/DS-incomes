export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly EXPENSES_CONTROLLER: any = Symbol.for('ExpensesController')
    public static readonly USERS_EXPENSES_CONTROLLER: any = Symbol.for('UsersExpensesController')

    // Services
    public static readonly EXPENSE_SERVICE: any = Symbol.for('ExpenseService')

    // Repositories
    public static readonly EXPENSE_REPOSITORY: any = Symbol.for('ExpenseRepository')

    // Models
    public static readonly EXPENSE_REPO_MODEL: any = Symbol.for('ExpenseRepoModel')

    // Mappers
    public static readonly EXPENSE_ENTITY_MAPPER: any = Symbol.for('ExpenseEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')

    // Tasks
    public static readonly REGISTER_DEFAULT_ADMIN_TASK: any = Symbol.for('RegisterDefaultAdminTask')
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUS_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
