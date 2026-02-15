import { Request,Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

class AddItemController
{
    async handle(req:Request,res:Response)
    {
        //receber os dados do item pelo corpo da requisicao
        const {order_id,product_id,amount} = req.body;
        
        const addItem = new AddItemOrderService();

        const item = await addItem.execute({order_id,product_id,amount
        });

        return res.status(200).json(item);
    }

}
export {AddItemController}