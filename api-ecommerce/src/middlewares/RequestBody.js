export const requestBody = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        errors: errorMessages,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
