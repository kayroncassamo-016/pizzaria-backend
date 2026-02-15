import prismaClient from "../../Prisma";

interface SendOrderProps {
  name: string;
  order_id: string;
}


class SendOrderService {

    async execute({ name, order_id }: SendOrderProps) {
        try
        {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                }
                })

            if(!order)
            {
                throw new Error("Order nao encontrada");
            }
        
        //Caso exista, a gente actualiza a propriedade draft para false (enviar para cozinha) e actualiza o name
        //draft signifca rascunho. Ou seja pedido que esta em rascunho se draft = true, se draft=false, pedido ja esta enviado para cozinha
        const updateOrder = await prismaClient.order.update({
            where: {
                id: order_id,
            },
            data: {
                draft: false,
                name: name, //O nome pode ser o nome do cliente da mesa
            }, 
            select:
            {
                id:true,
                table:true,
                name:true,
                draft:true,
                status:true,
                created_At:true
            }
           })
        
           return updateOrder;
         }
        catch(err)
        {
            throw new Error("Erro ao enviar order");
        }

    }

}

export { SendOrderService };