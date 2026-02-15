import multer from 'multer'
import crypto from 'crypto'// para as imagens nao se repetirem o seu nome (ja vem dentro do NodeJS, nao precisa instalar)

import {extname,resolve} from 'path' // (ja vem dentro do NodeJS, nao precisa instalar)

export default 
{
    upload (folder:string)
    {
       return {
        storage: multer.diskStorage ({

            destination: resolve (__dirname,'..','..',folder), //__dirname = config
            filename: (request,file,callback) =>
            {
                const fileHash = crypto.randomBytes(16).toString('hex')
                const fileName = `${fileHash}-${file.originalname}`
                
                return callback (null, fileName)
            }
        })
       }
    }
}
// O callback é uma função que o próprio Multer fornece.

// Ela serve para você dizer ao Multer:

// “Este é o nome final do arquivo que você deve SALVAR no disco.
//Sem o callback, o arquivo nunca seria salvo.

