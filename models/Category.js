
import mongoose, { Schema, model,models } from "mongoose"

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        // Thêm ràng buộc hoặc tùy chọn khác ở đây
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        // Thêm ràng buộc hoặc tùy chọn khác ở đây
    },
    properties: [{ type: Object }],
    // Thêm các thuộc tính khác ở đây
});

export const Category = models?.Category || model('Category', 
CategorySchema);