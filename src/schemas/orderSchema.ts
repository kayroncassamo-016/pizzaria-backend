import {z} from 'zod'
import { ca } from 'zod/v4/locales'

export const createOrderSchema = z.object ({

    body: z.object({
        
        table: z.number({message:"A table precisa ser um numero!"}).
        min(1, {message:"O nome eh obrigatorio!"})
        
    })
})

export const addItemSchema = z.object ({

    body: z.object({
        
        order_id: z.string({message:"O id precisa ser um numero!"}).
        min(1, {message:"O id eh obrigatorio!"}),
        
        product_id: z.string({message:"O id do produto precisa ser um texto"}).
        min(1, {message:"O id do produto eh obrigatorio!"})
        ,
        amount: z.number({message:"A quantidade precisa ser um numero!"}).
        min(1, {message:"A quantidade eh obrigatoria!"}).
        positive("Quantidade deve ser um numero positivo")
    })
})

export const removeItemSchema = z.object ({
    query: z.object({
        item_id: z.string({message:"O id do item precisa ser um texto"}).
        min(1, {message:"O id do item eh obrigatorio!"})
    })
})

export const detailOrderSchema = z.object ({
    query: z.object({
        order_id: z.string({message:"O id da order precisa ser um texto"}).
        min(1, {message:"O id da order eh obrigatorio!"})
    })
})

export const sendOrderSchema = z.object ({

    body: z.object({
        order_id: z.string({message:"O id precisa ser um texto"}).
        min(1, {message:"O id eh obrigatorio!"}),

        name: z.string({message:"O nome precisa ser um texto"}).
        min(1, {message:"O nome eh obrigatorio!"})  
    })
})


export const finishOrderSchema = z.object ({

    body: z.object({
        order_id: z.string({message:"O id precisa ser um texto"}).
        min(1, {message:"O id eh obrigatorio!"}),

    })
})

export const deleteOrderSchema = z.object ({
    query: z.object({
        order_id: z.string({message:"O id da order precisa ser um texto"}).
        min(1, {message:"O id da order eh obrigatorio!"})
    })
})
