import { Router } from "express";
import categoryService from "../services/categoryService";
import Category from "../models/category.model";

export const categoryRoute = Router();

categoryRoute.post("/addCategory", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send();
  } else {
    console.log(req.body);
    const category: Category = {
      name: req.body.name,
      child_of: req.body.child_of,
    };
    const token = req.headers.authorization;
    try {
      var result;
      await categoryService
        .addCategory(category, token)
        .then((result) => {
          console.log(result.output["output"]);
          if (!result.output["output"] || result.output["output"] == 0) {
            throw new Error("Failed to add category");
          } else {
            res.send({ result: true });
          }
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err);
      res.status(400).send({ result: true, err: err });
    }
  }
});

categoryRoute.get("/getCategories", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send();
  } else {
    const token = req.headers.authorization;
    const { query } = req;
    const page = query.page;
    const pageSize = query.pageSize;
    const getRoot = query.getRoot;
    const parentId = query.parentId;
    if (
      !!page &&
      !!pageSize &&
      !!getRoot &&
      typeof page === "string" &&
      typeof pageSize === "string" &&
      typeof getRoot === "string"
    ) {
      try {
        console.log(parentId);
        await categoryService
          .getCategories(
            token,
            parseInt(page),
            parseInt(pageSize),
            getRoot == "true",
            !!parentId && typeof parentId === "string"
              ? parseInt(parentId)
              : undefined
          )
          .then((result) => {
            if (!result) {
              throw new Error("Failed to get category");
            } else {
              res.send(result);
            }
          });
      } catch (err) {
        console.log(err);
        res.status(400).send({ result: true, err: err });
      }
    } else {
      res.status(400).send(new Error("Wrong Parameters"));
    }
  }
});
