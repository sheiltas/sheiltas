import * as express from 'express';
import { Document, Error, Model } from 'mongoose';
import { Request, Response } from 'express';

type apiFunction = (req: Request, res: Response) => void;

const handleError = (res: Response, error: Error, { status = 500 }) => res.status(status).send(error);
const handleSuccess = function <T>(
    res: Response,
    response: T | T[],
    options = {
        status: 200
    }
) {
    const { status } = options;
    res.status(status).send(response);
};

const tryCatchHandler = (tryFunc: apiFunction, req: Request, res: Response, options = { errStatus: 500 }) => {
    try {
        tryFunc(req, res);
    } catch (e) {
        const { errStatus } = options;
        handleError(res, e, { status: errStatus });
    }
};

const createRoutes = function <T extends Document>(routeName: string, model: Model<T>) {
    const baseUrl = `/${routeName}`;
    const router = express.Router();

    const getFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.find(req.body));

    router.get(baseUrl, async (req, res) => {
        tryCatchHandler(getFunction, req, res);
    });

    const postFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await Model.create(req.body), { status: 201 });

    router.post(baseUrl, async (req, res) => tryCatchHandler(postFunction, req, res));

    const deleteFunc = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await Model.findOneAndDelete(req.body));

    router.delete(baseUrl, async (req, res) => tryCatchHandler(deleteFunc, req, res));

    const putFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await Model.findOneAndUpdate(req.body));

    router.put(baseUrl, async (req, res) => tryCatchHandler(putFunction, req, res, { errStatus: 304 }));

    return router;
};

export default createRoutes;
