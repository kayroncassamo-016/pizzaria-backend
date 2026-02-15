import { Request, Response } from "express";
import { RemoveOrderItemService } from "../../services/order/RemoveOrderItemService";

class RemoveOrderItemController {
  async handle(req: Request, res: Response) {
   
      // item_id já foi validado pelo middleware validateSchema
      const item_id = req.query.item_id as string;

      const removeItemService = new RemoveOrderItemService();

      const deletedItem = await removeItemService.execute({ item_id });

      return res.status(200).json({
        message: "Item removido com sucesso",
      });
    } 
    
  
}

export { RemoveOrderItemController };
