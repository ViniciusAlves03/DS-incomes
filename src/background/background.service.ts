import { inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { Config } from '../utils/config'
import { ILogger } from '../utils/custom.logger'


@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.RPC_SERVER_EVENT_BUS_TASK) private readonly _rpcServerTask: IBackgroundTask,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            const dbConfigs = Config.getMongoConfig()
            await this._mongodb.tryConnect(dbConfigs.uri, dbConfigs.options)

            this._startTasks()
        } catch (err: any) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping services in background! ${err.message}`))
        }
    }

    private async _startTasks(): Promise<void> {
        const rabbitConfigs = Config.getRabbitConfig();

        try {
            const conn = await this._eventBus
                .connectionRpcServer
                .open(rabbitConfigs.uri, rabbitConfigs.options);

            this._logger.info('RPC Server connection established!');
            conn.on('disconnected', () => this._logger.warn('RPC Server connection has been lost...'));
            conn.on('reestablished', () => this._logger.info('RPC Server connection re-established!'));

            this._rpcServerTask.run();

        } catch (err: unknown) {
            const error = err as Error;
            this._logger.error(`Error trying to get connection to Event Bus for RPC Server. ${error.message}`);
        }

        try {
            const conn = await this._eventBus
                .connectionRpcClient
                .open(rabbitConfigs.uri, rabbitConfigs.options);

            this._logger.info('RPC Client connection established!');
            conn.on('disconnected', () => this._logger.warn('RPC Client connection has been lost...'));
            conn.on('reestablished', () => this._logger.info('RPC Client connection re-established!'));

        } catch (err: unknown) {
            const error = err as Error;
            this._logger.error(`Error trying to get connection to Event Bus for RPC Client. ${error.message}`);
        }
    }
}
