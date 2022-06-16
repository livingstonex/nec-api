module.exports = (req, res, next) => {
  req.pagination = (options = {}) => {
    const { maxLimit = 100 } = options;

    const { page = 1, checkpoint = null } = req.query;

    let { order = [['created_at', 'DESC']], limit = 30 } = req.query;

    if (order && typeof order === 'string') {
      order = JSON.parse(order);
    }

    limit = Number(limit);

    if (limit > maxLimit) {
      limit = maxLimit;
    }

    const offset = (page - 1) * limit;

    return {
      offset,
      limit,
      page,
      order,
      checkpoint,
    };
  };

  next();
};
