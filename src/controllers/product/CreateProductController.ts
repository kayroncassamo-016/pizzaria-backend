import { Request,Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";
import { file } from "zod";

class CreateProductController 
{
    async handle(req:Request,res:Response)
    {
        const {name,description,price,category_id} = req.body
        const numeric_price = Number(price)

        const createProductService = new CreateProductService()
        

        console.log("O nome eh"+name,"descricao:"+description
            +"price:",price, "categoria:", category_id

        )

        if (!req.file)
        {
            throw new Error ("Error upload file")
        }

      
            const {originalname,filename:banner} = req.file

            console.log("OriginalName: "+ originalname)

            const product = await createProductService.execute({
            name,numeric_price,
            description,
            imageBuffer:req.file.buffer,
            imageName:req.file.originalname,
            category_id
        })
            

           return res.json(product)
     
    }
}
export {CreateProductController}