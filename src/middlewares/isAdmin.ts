import { error } from "console";
import { Request,Response,NextFunction } from "express";
import prismaClient from "../Prisma"


export const isAdmin = async (req:Request,res:Response,next:NextFunction) =>
{
    const user_id = (req as any).user_id

    if (!user_id)
    {
        return res.status(400).json({
            error:"Usuario sem permissao!"
        })
    }

    const user = await prismaClient.user.findFirst({
        where:
        {
            id:user_id
        }
    })
    
    if(!user)
    {
       return res.status(400).json({error:"Usuario sem permissao!"})
    }

    if(user.role !== "ADMIN")
    {
       return res.status(400).json({error:"Usuario sem permissao!"})
    }
    
    return next()
     
};