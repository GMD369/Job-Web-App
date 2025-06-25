export const onlyEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can perform this action" });
  }
  next();
};
export const onlySeeker = (req, res, next) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ message: "Only Job Seeker can perform this action" });
  }
  next();
};