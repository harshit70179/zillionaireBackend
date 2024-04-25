var jwt = require("jsonwebtoken");
var configFile = require("../../config/jwt_config");
var bcrypt = require("bcryptjs");
let db = require("../../config/db");

exports.login = async (req, res) => {
  try {
    const userdata = "SELECT * FROM user WHERE email=?";
    db.query(userdata, [req.body.email], async (err, checkResult) => {
      if (err) {
        console.log(err);
      } else {
        if (checkResult.length > 0) {
          const passwordcompare = await bcrypt.compare(
            req.body.password,
            checkResult[0].password
          );
          if (!passwordcompare) {
            res.send({
              status: false,
              message: "Please try to login with corrent crediential",
            });
          } else {
            const data = {
              id: checkResult[0].id,
            };
            var token = jwt.sign(data, configFile.secret);
            res.json({
              status: true,
              authtoken: token,
              type: checkResult[0].user_type,
              message: "Your account login successfully",
            });
          }
        } else {
          return res.send({
            status: false,
            message: "Please try to login with corrent crediential",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).send("Internalserver Error");
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.loginUserId;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!oldPassword) {
      return res.send({
        status: false,
        message: "Current password is required",
      });
    }
    if (!newPassword) {
      return res.send({ status: false, message: "New password is required" });
    }
    if (!confirmPassword) {
      return res.send({
        status: false,
        message: "Confirm password is required",
      });
    }
    if (confirmPassword != newPassword) {
      return res.send({
        status: false,
        message: "Confirm password doesn't match",
      });
    }

    let getQuery = "SELECT * FROM user WHERE id=?";
    db.query(getQuery, [userId], async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          const passwordcompare = await bcrypt.compare(
            oldPassword,
            result[0].password
          );
          if (!passwordcompare) {
            return res.send({
              success: false,
              error: "Please try to correct old password",
            });
          } else {
            const saltRounds = 10;
            const salt = await bcrypt.genSaltSync(saltRounds);
            const newhashpassword = await bcrypt.hashSync(newPassword, salt);
            const oldpasswordcompare = await bcrypt.compare(
              oldPassword,
              newhashpassword
            );
            if (oldpasswordcompare) {
              res.send({
                success: false,
                error: "Please enter different password",
              });
            } else {
              let updateQuery = "UPDATE user SET password=? WHERE id=?";
              db.query(
                updateQuery,
                [newhashpassword, userId],
                (err, excuteUpdate) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (excuteUpdate) {
                      res.send({
                        status: true,
                        message: "Password updated successfully",
                      });
                    }
                  }
                }
              );
            }
          }
        }
      }
    });
  } catch (error) {
    res.status(500).send("Internalserver Error");
  }
};
