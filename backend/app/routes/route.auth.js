const UserController = require("../controllers/controller.user");
const AuthController = require("../controllers/controller.auth");
const router = require("express").Router();

const userSchema = require("../validators/validator.user");
const loginSchema = require("../validators/validator.login");
const validate = require("../middlewares/middleware.validator");

router.post("/register", validate(userSchema), UserController.register);
router.post("/login", validate(loginSchema), AuthController.attemptLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);

const WordEmailController = require("../controllers/controller.wordEmail");

router.post("/save-word-email", WordEmailController.saveWordEmail);
router.get("/saved-words/:email", WordEmailController.getSavedWordsByEmail);

module.exports = router;
