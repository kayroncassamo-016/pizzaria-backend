import { Request,Response } from "express";
import { DeleteOrderService } from "../../services/order/DeleteOrderService";

class DeleteOrderController
{
    async handle(req:Request,res:Response)
    {
        const order_id = req.query.order_id as string

        const remove_order  = new DeleteOrderService()

        const order = await remove_order.execute({order_id})

        return res.json(order)
    }

    
}

export {DeleteOrderController}