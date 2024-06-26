import { Document, Schema, model, Types } from 'mongoose';
import { UserDocument } from './user.model';

export type Todo = {
    userId: UserDocument['id'];
    title: string;
    dueDate?: Date;

    completed: boolean;
    archived: boolean;
};

export type TodoDocument = Document<string> & Todo;

const TodoSchema = new Schema<TodoDocument>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: false },
    
    completed: { type: Boolean, required: true, default: false },
    archived: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

export default model<TodoDocument>('Todo', TodoSchema);
