import prismaClient from "../../Prisma";  //importando o client do prisma

interface ItemProps
{
    order_id:string;
    product_id:string;
    amount:number;
}

class AddItemOrderService
{
    async execute({order_id, product_id, amount}:ItemProps)
    {
        try {

            const orderExists = await prismaClient.order.findFirst({
                where:
                {
                    id:order_id
                }
            })
              if(!orderExists){
                    throw new Error("Pedido nao encontrado")
                }

            const productExists = await prismaClient.product.findFirst({
                where:
                {
                    id:product_id
                }
            })
                if(!productExists){ 

                    throw new Error("Produto nao encontrado")
                }

                const item = await prismaClient.item.create({
                    data:
                    {   
                        order_id:order_id,
                        product_id:product_id,
                        amount:amount   
                    },
                    select:
                    {   
                        id:true,
                        order_id:true,
                        product_id:true,
                        amount:true,
                        created_At:true,
                        product:
                        {
                            select:
                            {
                                id:true,
                                name:true,
                                price:true,
                                banner:true,
                                description:true
                            }
                        }
                        }
                
                })
                return item
        }
       
        catch (error)
        {
            console.log(error)
            throw new Error("Erro ao adicionar item no pedido")
        }

    }
}

export {AddItemOrderService}