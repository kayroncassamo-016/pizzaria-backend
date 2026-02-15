import {Request, Response} from 'express'
import { DeleteProductService } from '../../services/product/DeleteProductService'  

class DeleteProductController {
    async handle (req:Request, res:Response)
    {
        const {product_id} = req.query as {product_id:string}
        const deleteProductService = new DeleteProductService()

        const result = await deleteProductService.execute({product_id})
        
        return res.status(200).json(result)
    }
}

export {DeleteProductController}