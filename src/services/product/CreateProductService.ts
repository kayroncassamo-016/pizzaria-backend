import { error } from 'node:console'
import prismaClient from '../../Prisma'
import cloudinary from '../../config/cloudinary'
import { Readable } from 'node:stream' //Permite transformar um Buffer em um stream (necessário para o upload).
import { id } from 'zod/v4/locales'

interface ProductRequest
{
    name:string
    numeric_price:number
    description:string
    // banner:string
    category_id:string
     imageBuffer: Buffer //os bytes reais da imagem
     imageName :string
}

class CreateProductService 
{
    async execute ({name,numeric_price,description,category_id
        ,imageBuffer,imageName
    }:ProductRequest)
    {
    
        const categoryExists = await prismaClient.category.findFirst({
            where:
            {
                id:category_id
            }
        })  


        if (!categoryExists)
        {
            throw new Error ("Categoria nao existe.")
        }


        let banner_url =''

        try{
            const result = await new Promise<any>((resolve, reject) => {
                const uploadstream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'products',
                        resource_type: 'image',
                        public_id:`${Date.now()}_${imageName.split('.')[0]}`,
                    },(error,result)=>{
                        if (error) 
                            reject (error)
                        else 
                            resolve (result)
                    })

                    const BufferStream = Readable.from(imageBuffer)
                    BufferStream.pipe (uploadstream)    

                }
            )  
            
            banner_url = result.secure_url
        }
      
        catch (err)
        {
            //throw new Error ("Erro ao enviar imagem para o cloudinary.")
            if(err instanceof Error)
            {
                return {error:err.message}
            }
        }


        const product = await prismaClient.product.create
        ({
            data:
            {
                name:name,
                price:numeric_price,
                description:description,
               // banner:banner,
                banner:banner_url,
                category_id:category_id
            }, 
            select:
            {
                id:true,
                name:true,
                description:true,
                price:true,
                banner:true,
                category_id:true,
                created_At:true,
                category:
                {
                  select:
                  {
                    id:true,
                    name:true,
                    
                  }
                }
            }
        })
        
       return product
    }
}
export {CreateProductService}