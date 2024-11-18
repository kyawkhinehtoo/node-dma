if (req.body.password) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  // First, fetch the existing password from rm_users table
  const checkPasswordSql = `SELECT password FROM rm_users WHERE username = ?`;
  db.query(
    checkPasswordSql,
    [req.body.username],
    (checkError, checkResults) => {
      if (checkError) {
        console.error("Error fetching current password:", checkError);
        return res
          .status(500)
          .json({ error: true, message: "Error fetching current password" });
      }

      if (checkResults.length > 0) {
        const currentPassword = checkResults[0].password;

        // Compare the hashed password with the stored password
        if (bcrypt.compareSync(req.body.password, currentPassword)) {
          console.log("Password matches, no need to update");
          return; // Skip the password and radcheck updates
        }

        // If password doesn't match, proceed to update both rm_users and radcheck
        args.push(hashedPassword);
        sql += ", password = ?";

        // Update the radcheck table
        const radcheckSql = `
        UPDATE radcheck 
        SET value = ? 
        WHERE username = ? AND attribute = "Cleartext-Password"
      `;
        db.query(
          radcheckSql,
          [req.body.password, req.body.username],
          (radError, radResults) => {
            if (radError) {
              console.error("Error updating radcheck table:", radError);
              return res
                .status(500)
                .json({
                  error: true,
                  message: "Error updating radcheck table",
                });
            }
            console.log("Radcheck updated:", radResults);
          }
        );
      } else {
        console.warn("Username not found in rm_users table");
        return res.status(404).json({ error: true, message: "User not found" });
      }
    }
  );
}
