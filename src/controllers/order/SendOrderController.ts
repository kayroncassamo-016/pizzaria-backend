import {Request,Response} from "express";
import { SendOrderService } from "../../services/order/SendOrderService";   

class SendOrderController {
    async handle (req:Request, res:Response) {
            const {name,order_id }= req.body;
            const sendOrderService = new SendOrderService();

            const order = await sendOrderService.execute(
                {order_id, name}); 

            return res.status(200).json(order);

    }
}
export {SendOrderController};
