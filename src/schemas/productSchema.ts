import {z} from 'zod'
import { ca } from 'zod/v4/locales'

export const createProductSchema = z.object ({

    body: z.object({
        
        name: z.string({message:"O nome precisa ser um texto"}).
        min(1, {message:"O nome eh obrigatorio!"})
        ,
        price: z.string().
        min(1,{message:"O preco eh obrigatorio !"})
        ,
        description: z.string({message:"A descricao precisa ser um texto"}).
        min(1, {message:"A descricao do produto eh obrigatoria!"})
        ,
        category_id: z.string({message:"A categoria precisa ser um texto"}).
       min(1, {message:"A categoria do produto eh obrigatoria!"})

    })
})

export const listProductsSchema = z.object({
    query: z.object({
        disabled: z.string().optional().default('false').transform(val => val === 'true')
    }).optional()
})

export const listproductByCategorySchema = z.object({
    query: z.object({
        category_id: z.string({message:"O ID da categoria precisa ser um texto"}).
        min(1, {message:"O ID da categoria eh obrigatorio!"})
    })
})