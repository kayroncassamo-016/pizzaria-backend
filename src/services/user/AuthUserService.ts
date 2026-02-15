import prismaclient from "../../Prisma"
import {compare} from "bcryptjs"

import {sign} from 'jsonwebtoken'

interface AuthRequest {
    email: string
    password: string  
}

class AuthUserService{
    async execute({email,password}:AuthRequest)
    {
        //console.log(email)
        //Verificar se o usuario existe
        const user = await prismaclient.user.findFirst({
            where:{
                email:email
            }
        })

        if(!user){
            throw new Error("User/password incorrect")
        }
        //preciso verificar se a senha que ele mandou esta correcta ou nao!

        const passwordMatch = await compare(password,user.password)
        
        if (!passwordMatch)
        {
            throw new Error("User/password incorrect")
        }
        
        //se deu tudo certo, vamos gerar o token do usuario
        const token = sign({
            name: user.name,
           email:user.email
        },
        process.env.JWT_SECRET, 
        {
            subject:user.id,
            expiresIn:'30d'

        }  
    )  
       
        return {
            id:user.id,
            name:user.name,
            email: user.email,
            role:user.role,
            token: token
        }
    
   }
}
export default AuthUserService