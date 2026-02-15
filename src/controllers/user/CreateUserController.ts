import  {Request,Response,response} from 'express'
import { CreateUserService } from '../../services/user/CreateUserService'

class CreateUserController {
    async handle(req:Request,res:Response)
    {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
      // const {name,email,password} = req.body
       const createUserService =  new CreateUserService()

       const user = await createUserService.execute({
        name,email,password}
       )

       return res.json(user)
    }
}

export {CreateUserController}

//   async handle(req:Request,res:Response)
//     {
//         const name = req.body.name
//         const email = req.body.email
//         const password = req.body.password
//       // const {name,email,password} = req.body
//        const createUserService =  new CreateUserService()

//        const user = await createUserService.execute(req.body
//        )

//        return res.send(user)
//     }
// }