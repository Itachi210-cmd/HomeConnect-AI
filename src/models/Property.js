import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this property.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for this property.'],
    },
    price: {
        type: String,
        required: [true, 'Please specify the price.'],
    },
    location: {
        type: String,
        required: [true, 'Please specify the location.'],
    },
    address: {
        type: String,
        required: [true, 'Please specify the full address.'],
    },
    type: {
        type: String,
        enum: ['House', 'Apartment', 'Condo', 'Villa', 'Land'],
        default: 'House',
    },
    status: {
        type: String,
        enum: ['For Sale', 'For Rent', 'Sold'],
        default: 'For Sale',
    },
    beds: {
        type: Number,
        required: true,
    },
    baths: {
        type: Number,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs
        default: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
