import { Router } from "express";
import { register,login} from "../controllers/user_controller";
import { Easysave} from "../controllers/vault_controller";

import LoginAuthorization from "../Auth/user_authorization";
import { AddFundsToVault, WithdrawFundsFromVault } from "../controllers/vault_controller";
const router = Router();
 


router.post("/register", register);
router.post("/login", login)
router.get("/autosave/get_easy_save",LoginAuthorization, Easysave)
router.post("/autosave/addfund",LoginAuthorization, AddFundsToVault)
router.post("/autosave/withdraw",LoginAuthorization, WithdrawFundsFromVault)


export default router
