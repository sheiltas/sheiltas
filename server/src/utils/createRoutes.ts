import * as express from 'express';
import { Document, Error, Model } from 'mongoose';
import { Request, Response } from 'express';

type apiFunction = (req: Request, res: Response) => Promise<void>;

type handleErrorFunction = (res: Response, error: Error, options?: { status: number }) => void;

export const handleError: handleErrorFunction = (res, error, options = { status: 500 }) => {
    const { status } = options;
    res.status(status).send(error);
};

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

const tryCatchHandler = async (
    tryFunc: apiFunction,
    req: Request,
    res: Response,
    options = { errStatus: 500 }
) => {
    try {
        await tryFunc(req, res);
    } catch (e) {
        console.log(e);

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
        await tryCatchHandler(getFunction, req, res);
    });

    const postFunction = async (req: Request, res: Response) => {
        handleSuccess<T>(res, await model.create(req.body), { status: 201 });
    };

    router.post(baseUrl, async (req, res) => await tryCatchHandler(postFunction, req, res));

    const deleteFunc = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.findOneAndDelete(req.body));

    router.delete(baseUrl, async (req, res) => await tryCatchHandler(deleteFunc, req, res));

    const putFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.findOneAndUpdate(req.body));

    router.put(baseUrl, async (req, res) => await tryCatchHandler(putFunction, req, res, { errStatus: 304 }));

    return router;
};

export default createRoutes;
