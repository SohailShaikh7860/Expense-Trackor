import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const tripStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'trip_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
})

const expenseReceiptStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'expense_receipts',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
        transformation: [{ width: 2000, height: 2000, crop: 'limit' }]
    }
})

const upload = multer({ 
    storage: tripStorage,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
});

const uploadExpenseReceipt = multer({ 
    storage: expenseReceiptStorage,
    limits:{
        fileSize: 10 * 1024 * 1024 
    }
});

export {cloudinary, upload, uploadExpenseReceipt};