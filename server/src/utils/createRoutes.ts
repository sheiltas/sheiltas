import * as express from 'express';
import { Document, Error, Model } from 'mongoose';
import { Request, RequestHandler, Response } from 'express';
import { methods } from '../../../client/src/types';

type apiFunction = (req: Request, res: Response) => Promise<void | Response<any>>;

type handleErrorFunction = (res: Response, error: Error, options?: { status: number }) => void;

export const handleError: handleErrorFunction = (res, error, options = { status: 500 }) => {
    console.error('Error: ', Error);
    const { status } = options;
    res.status(status).send(error);
};

export const handleSuccess = function <T>(
    res: Response,
    response: T | T[],
    options = {
        status: 200
    }
) {
    const { status } = options;
    res.status(status).send(response);
};

export const tryCatchHandler = async (
    tryFunc: apiFunction,
    req: Request,
    res: Response,
    options = { errStatus: 500 }
) => {
    try {
        await tryFunc(req, res);
    } catch (e) {
        const { errStatus } = options;
        handleError(res, e, { status: errStatus });
    }
};

/**
 *
 * @param routeName
 * The url of the route
 * @param model
 * A mongoose model
 * @param options
 * options to change the default routes created
 * @param options.middleware
 * Single or array of middlewares to happen before the main operation
 * @param options.exclude
 * Array of REST methods
 * @param options.overrides
 * REST keys - RequestHandler functions to override the base methods (Good for population)
 */
const createRoutes = function <T extends Document>(
    routeName: string,
    model: Model<T>,
    options: {
        middleware?: Array<RequestHandler> | RequestHandler;
        exclude?: Array<methods>;
        overrides?: Partial<Record<methods, apiFunction>>;
    } = {
        exclude: [],
        overrides: {}
    }
) {
    const { middleware, exclude = [], overrides = {} } = options;
    const baseUrl = `/${routeName}`;
    const router = express.Router();

    if (middleware) {
        router.use(baseUrl, middleware);
    }

    const getFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.find(req.body));

    const postFunction = async (req: Request, res: Response) => {
        handleSuccess<T>(res, await model.create({ ...req.body, author: res.locals.authData?._id }), {
            status: 201
        });
    };

    const deleteFunc = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.findOneAndDelete(req.body));

    const putFunction = async (req: Request, res: Response) =>
        handleSuccess<T>(res, await model.findOneAndUpdate(req.body));

    if (!exclude.includes('get')) {
        router.get(baseUrl, async (req, res) => {
            await tryCatchHandler(overrides.get || getFunction, req, res);
        });
    }

    if (!exclude.includes('post')) {
        router.post(
            baseUrl,
            async (req, res) => await tryCatchHandler(overrides.post || postFunction, req, res)
        );
    }

    if (!exclude.includes('delete')) {
        router.delete(
            baseUrl,
            async (req, res) => await tryCatchHandler(overrides.delete || deleteFunc, req, res)
        );
    }

    if (!exclude.includes('put')) {
        router.put(
            baseUrl,
            async (req, res) =>
                await tryCatchHandler(overrides.put || putFunction, req, res, { errStatus: 304 })
        );
    }

    return router;
};

export default createRoutes;
