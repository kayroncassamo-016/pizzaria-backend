import { NextFunction, Request,Response } from "express";
import {verify} from "jsonwebtoken"

interface PayLoad 
{
    sub:string
}

function isAuthenticated (req:Request,res:Response,next:NextFunction)
{
    //console.log('Chamou o middleware')   

   const authToken = req.headers.authorization

   if(!authToken)
   {
    return res.status(401).end();

   }

   //const [, token] = authToken.split(" ") 

   const parts = authToken.split(" ");
   const token = parts[1];

    try 
    { //Validar esse token
      const {sub} = verify(
        token,
        process.env.JWT_SECRET
      ) as PayLoad
       
 
      //Recuperar o id do token e colocar dentro de uma variavel user_id dentro do req.
      //const user_id = (req as any).user_id;
      (req as any).user_id = sub 
      
      return next()
      //console.log(sub)
    } 
    catch(err)
    {
       return res.status(401).json ({err:"Unauthorized"}) //Unauthorized
    }
}

export {isAuthenticated}


     // const payload = verify(token, process.env.JWT_SECRET)
      // const sub = payload.sub
//       verify confirma duas coisas:

        // 👉 "Este token foi criado com a minha JWT_SECRET?"
        // (Autenticidade — garante que não é falsificação)

        // 👉 "Este token ainda não expirou?"
        // (Validade — garante que ainda pode ser usado)

        // Se tudo estiver OK, ele devolve o payload.
       //Se NÃO corresponder → token falso → 401.
      //       Explicação REAL:

      // verify abre o token e verifica

      // devolve o payload (as infos dentro do token)

      // você extrai o ID do usuário desse payload

    // exemplo de payload: 
    // payload = {
    //       sub: "123",
    //       email: "kayron@example.com",
    //       iat: 1710000000,
    //       exp: 1710050000
    //     }
