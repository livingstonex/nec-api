module.exports = (req, res, next) => {
    res.ok = ({
      status = 'ok', data, message = 'OK', meta,
    }) => res.status(200).json({
      status,
      message,
      data,
      meta,
    });
  
    res.created = ({
      status = 'created', data, message = 'OK', meta,
    }) => res.status(201).json({
      status,
      message,
      data,
      meta,
    });
  
    res.badRequest = ({
      status = 'bad-request', message, code, ...rest
    }) => res.status(code || 400).json({
      status,
      message,
      ...rest,
    });
  
    res.serverError = ({
      status = 'server-error', message, code, ...rest
    }) => res.status(code || 500).json({
      status,
      message,
      ...rest,
    });
  
    res.notModified = () => res.status(304).send();
  
    res.unavailable = ({
      status = 'service-unavailable', message, code, ...rest
    }) => res.status(code || 503).json({
      status,
      message,
      ...rest,
    });
  
    res.unprocessable = ({
      status = 'unprocessable', message, code, ...rest
    }) => res.status(code || 422).json({
      status,
      responseCode: code || 422,
      message,
      ...rest,
    });
  
    res.paymentRequired = ({
      status = 'payment-required', message, code, ...rest
    }) => res.status(code || 402).json({
      status,
      message,
      ...rest,
    });
  
    res.notFound = ({
      status = 'not-found', message, code, ...rest
    }) => res.status(code || 404).json({
      status,
      responseCode: code || 404,
      message,
      ...rest,
    });
  
    res.forbidden = ({ status = 'forbidden', message, code }) => res.status(code || 403).json({
      status,
      message,
    });
  
    res.unauthorized = ({
      status = 'unauthorized', message, code, ...rest
    }) => res.status(code || 401).json({
      status,
      message,
      ...rest,
    });
  
    res.busy = ({
      status = 'server-busy', message, code, delay = [20, 40, 60],
    }) => res.status(code || 503).json({
      status,
      message,
      delay,
    });
  
    res.pagination = (count = 0, limit = 30) => {
      const meta = {
        total: count,
        pages: Math.ceil(count / limit),
      };
  
      return meta;
    };
  
    next();
  };
  