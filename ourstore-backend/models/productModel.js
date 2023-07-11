import mongoose from 'mongoose';
import validator from 'validator';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        maxlength: [100, 'A product name must have less than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
        min: [0, 'The price ({VALUE}) is lower than 0'],
        max: [10000000000, 'The price ({VALUE}) exceeds the limit (1e+10)'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A product must have a description'],
        trim: true,
        maxlength: [2000, 'A product must have less than 2000 characters']
    },
    images: [
        {
            imageLink: {
                type: String,
                validate: {
                    validator: validator.isURL,
                    message: 'Image link "{VALUE}" should be a valid URL link'
                }
            }
        }
    ]
});

const Product = mongoose.model('Product', productSchema);

export default Product;