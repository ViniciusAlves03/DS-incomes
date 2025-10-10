import Mongoose from 'mongoose'

interface IIncomeModel extends Mongoose.Document {
}

const incomeSchema = new Mongoose.Schema({
    id: Mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    amount: Number,
    date: String,
    categoryId: {
        type: Mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    userId: Mongoose.Types.ObjectId
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: {
            transform: (doc, ret) => {
                const { _id, __v, ...rest } = ret;

                const newRet = { id: _id, ...rest };

                return newRet;
            }
        }
    })

export const IncomeRepoModel = Mongoose.model<IIncomeModel>('Income', incomeSchema)
