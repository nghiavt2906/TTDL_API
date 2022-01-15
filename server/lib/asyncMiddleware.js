const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
      .catch(err => {
        // console.log('Looix day nek', err)
        next(err)
      });
};

export default asyncMiddleware