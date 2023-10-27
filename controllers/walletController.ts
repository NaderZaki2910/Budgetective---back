import { Router } from "express";
import walletService from "../services/walletService";
import Wallet from "../models/wallet.model";

export const walletRoute = Router();

walletRoute.post("/addWallet", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send();
  } else {
    const wallet: Wallet = {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
    };
    const token = req.headers.authorization;
    try {
      var result;
      await walletService
        .addWallet(wallet, token)
        .then((result) => {
          console.log(result.output["output"]);
          if (!result.output["output"] || result.output["output"] == 0) {
            throw new Error("Failed to add wallet");
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

walletRoute.get("/getWallets", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send();
  } else {
    const token = req.headers.authorization;
    const { query } = req;
    const page = query.page;
    const pageSize = query.pageSize;
    if (
      !!page &&
      !!pageSize &&
      typeof page === "string" &&
      typeof pageSize === "string"
    ) {
      try {
        await walletService
          .getWallets(token, parseInt(page), parseInt(pageSize))
          .then((result) => {
            if (!result) {
              throw new Error("Failed to get wallet");
            } else {
              console.log(result, "after paging");
              res.send(result);
            }
          })
          .catch((err) => {
            throw err;
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
