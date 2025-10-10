import { Entity } from './entity'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'


export class Income extends Entity implements IJSONSerializable, IJSONDeserializable<Income> {
    private _title?: string
    private _description?: string
    private _amount?: number
    private _date?: string
    private _categoryId?: string
    private _userId?: string

    constructor() {
        super()
    }

    get title(): string | undefined {
        return this._title
    }

    set title(value: string | undefined) {
        this._title = value
    }

    get description(): string | undefined {
        return this._description
    }

    set description(value: string | undefined) {
        this._description = value
    }

    get amount(): number | undefined {
        return this._amount
    }

    set amount(value: number | undefined) {
        this._amount = value
    }

    get date(): string | undefined {
        return this._date
    }

    set date(value: string | undefined) {
        this._date = value
    }

    get categoryId(): string | undefined {
        return this._categoryId
    }

    set categoryId(value: string | undefined) {
        this._categoryId = value
    }

    get userId(): string | undefined {
        return this._userId
    }

    set userId(value: string | undefined) {
        this._userId = value
    }

    public fromJSON(json: any): Income {
        if (!json) return this
        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }

        if (json.title) this.title = json.title
        if (json.description) this.description = json.description
        if (json.amount) this.amount = json.amount
        if (json.date) this.date = json.date
        if (json.categoryId) this.categoryId = json.categoryId
        if (json.userId) this.userId = json.userId

        return this
    }

    public toJSON(): any {
        return {
            id: super.id ? super.id : undefined,
            title: this.title ? this.title : undefined,
            description: this.description ? this.description : undefined,
            amount: this.amount ? this.amount : undefined,
            date: this.date ? this.date : undefined,
            categoryId: this.categoryId ? this.categoryId : undefined,
            userId: this.userId ? this.userId : undefined,
            created_at: super.created_at ? super.created_at : undefined,
            updated_at: super.updated_at ? super.updated_at : undefined,
        }
    }
}
