const express = require("express");
const validate = require("./middleware/validate");
const { registerSchema ,
        loginSchema
} = require("./validators/authValidators");
const { register,
       login
} = require("./controllers/authController");
const { createAccountSchema 
} = require("./validators/accountValidators");
const { createAccount,
        getAccounts,
        getAccountDetails,
        getAccountHistory
} = require("./controllers/accountController");

const router = express.Router();


router.get("/", (req, res) => {
    res.json({
        message: "Bank API is running"
    });
});

router.post(
    "/auth/register",
    validate(registerSchema),
    register
);

router.post(
    "/auth/login",
    validate(loginSchema),
    login
);
const authenticate = require("./middleware/authMiddleware");

router.get("/test-auth", authenticate, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    });
});

router.post(
    "/accounts",
    authenticate,
    validate(createAccountSchema),
    createAccount
);

router.get(
    "/accounts",
    authenticate,
    getAccounts
);

router.get(
    "/accounts/:account_number",
    authenticate,
    getAccountDetails
);

router.get(
     "/accounts/:account_number/history",
     authenticate,
     getAccountHistory
)
module.exports = router;