import mongoose, { Schema } from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
    type: String,
    default: null
    },
    extractedText: {
        type: String,
        default:''
    },
    summary: {
        type: String,
        default:''
    },
    chunks: [
        {
            content: {
                type: String,
                required: true
            },
            pageNumber:{
                type: String,
                required: true
            }
        }
    ],
    uploadDate:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['processing' , 'ready' , 'failed']
    },
    fileSize:{
        type: Number,
    }
},{
    timestamps: true
})

//Index for faster queries
documentSchema.index({userId: 1, uploadDate: -1 });
const Document = mongoose.model('Document', documentSchema);
export default Document;