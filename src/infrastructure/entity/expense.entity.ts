import { Entity } from './entity'


export class ExpenseEntity extends Entity {
    public id?: string
    public title?: string
    public description?: string
    public amount?: number
    public date?: string
    public categoryId?: string
    public userId?: string
}
