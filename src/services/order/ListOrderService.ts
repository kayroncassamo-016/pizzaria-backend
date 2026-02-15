import  prismaClient  from "../../Prisma";

interface ListOrderProps
{
    draft?:string;
}

class ListOrderService
{
    async execute({draft}:ListOrderProps)
    {
        const orders = await prismaClient.order.findMany({
           where:
           {
             draft: draft === "true"? true : false   
           },

           select:
           {
             id:true,
             table:true,
             name:true,
             status:true,
             draft:true,
             created_At:true,
             Items:
             {
                select:
                {
                    id:true,
                    amount:true,
                product:
                {
                    select:
                    {
                        id:true,    
                        name:true,
                        price:true,
                        description:true,
                        banner:true
                    }
                }
             }

           }
        }
          
    })

        return orders
}
}
export {ListOrderService}
