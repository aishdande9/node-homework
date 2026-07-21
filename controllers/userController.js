const register = (req, res) => {
    const { name, email, password } = req.body;
  
    const newUser = {
      name,
      email,
      password,
    };
  
    global.users.push(newUser);
    global.user_id = newUser;
  
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  };
  
  const logon = (req, res) => {
    const { email, password } = req.body;
  
    const matchingUser = global.users.find(
      (user) => user.email === email && user.password === password,
    );
  
    if (!matchingUser) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
  
    global.user_id = matchingUser;
  
    return res.status(200).json({
      name: matchingUser.name,
      email: matchingUser.email,
    });
  };
  
  const logoff = (req, res) => {
    global.user_id = null;
  
    res.status(200).json({
      message: "Logged off successfully",
    });
  };
  
  module.exports = {
    register,
    logon,
    logoff,
  };