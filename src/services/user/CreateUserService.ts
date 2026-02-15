import prismaClient from "../../Prisma"
import {hash} from 'bcryptjs'

interface UserRequest {
    name:string
    email:string
    password:string
}

class CreateUserService {

    async execute ({name,email,password}:UserRequest)
    {
       //Verificar se ele enviou um email
       if(!email)
       {
          throw new Error('Email Incorrecto')
       }


       //verificar se esse email ja esta cadastrado na plataforma
        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email:email
            }})

        if(userAlreadyExists)
        {
            throw new Error('User already exists')
        }
        const passwordHash = await hash(password,8)

        const user = await prismaClient.user.create({
            data:{
                name:name,
                email:email,
                password:passwordHash
            },
            select:{
                id:true,
                name:true,
                email:true
            }
        })
        return user;
  }
}


export {CreateUserService}



  // console.log(name, password)
  // return {ok:email}








// class CreateUserService {

//     async execute (user:UserRequest)
//     {
//         console.log(user.name)
//         return {ok:name}
//     }
// }
// export {CreateUserService}