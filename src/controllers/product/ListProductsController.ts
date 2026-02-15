import { Request, Response } from "express";
import { ListProductsService } from "../../services/product/ListProductsService";

class ListProductsController {
  async handle(req: Request, res: Response) {
    try {
      // Recebe query param "disabled" e define valor padrão como false
      const disabled = req.query.disabled
        ? req.query.disabled === "true"
        : false;

      const listProductsService = new ListProductsService();

      const products = await listProductsService.execute({ disabled });

      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }
}

export { ListProductsController };
