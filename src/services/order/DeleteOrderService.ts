import prismaClient from '../../Prisma'

interface OrderRequest
{
    order_id:string
}

class DeleteOrderService 
{
    async execute ({order_id}:OrderRequest)
    {
        try
        {

        const order = await prismaClient.order.findFirst({
            where:
            {
                id:order_id
            }
        })
        
         if(!order)
         {
            throw new Error("Order não encontrada");
         }

         await prismaClient.order.delete({
            where:
            {
                id:order_id
            }
         })

        return {message:"Order deletada com sucesso!"};
        }

        catch(err)
        {
            throw new Error("Erro ao deletar order");
        }
    }
}

export {DeleteOrderService}