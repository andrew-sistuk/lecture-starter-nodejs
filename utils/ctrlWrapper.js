export const ctrlWrapper = (controller) => {
    return (req, res, next) => {
        try {
            controller(req, res, next);
        } catch (err) {
            res.err = err;
        } finally {
            next();
        }
    };
};