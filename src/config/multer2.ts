import multer from 'multer';
import { file } from 'zod';

export default {
    storage: multer.memoryStorage(),
    limits:
    {
        fileSize: 4 * 1024 * 1024 //4 MB
    },
    fileFilter: (req:any,file:Express.Multer.File,cb:any) =>
    {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype))
        {
            cb(null,true);
        }
        else 
        {
            cb (new Error("Formato de arquivo invalido.Use apenas jpg,png e gif"));
        }
    }

}