const responseMiddleware = (req, res, next) => {
  if (res.err) {
    const status = res.err.status || 400;
    return res.status(status).json({
      error: true,
      message: res.err.message || "Request error",
    });
  }

  if (res.data === undefined) {
    return res.status(404).json({
      error: true,
      message: "Data not found",
    });
  }

  res.status(200).json(res.data);
};

export { responseMiddleware };
