import { publicProcedure } from "./trpc";

type Contract<
  TEndpoint extends string,
  TValidator extends Parameters<typeof publicProcedure.input>[0] | undefined,
> = TValidator extends undefined
  ? { endpoint: TEndpoint }
  : {
    endpoint: TEndpoint;
    validator: TValidator;
  };

const contract = <
  TEndpoint extends string,
  TValidator extends Parameters<typeof publicProcedure.input>[0] | undefined,
>(
  contract: Contract<TEndpoint, TValidator>,
) => contract;

const endpoint = <
  TEndpoint extends string,
  TValidator extends Parameters<typeof publicProcedure.input>[0] | undefined,
  TContract extends Contract<TEndpoint, TValidator>,
  TProcedure,
>(
  contract: TContract,
  procedure: (contract: TContract) => TProcedure,
) => {
  return procedure(contract);
};

const response = <
  TData,
  TActions extends {
    [endpoint: string]: Record<string, unknown>;
  },
>(
  data: TData,
  actions: TActions,
) => ({ data, actions });

const createAction = <
  TEndpoint extends string,
  TRest extends Record<string, unknown>,
>(
  endpoint: TEndpoint,
  rest: TRest,
): Record<TEndpoint, { endpoint: TEndpoint } & TRest> => {
  type Result = Record<TEndpoint, { endpoint: TEndpoint } & TRest>;
  const result: Result | object = {};
  (result as Result)[endpoint] = { endpoint, ...rest };
  return result as Result;
};

const routeEndpoints = <
  TEndpoint extends string,
  TValidator extends Parameters<typeof publicProcedure.input>[0] | undefined,
  TContract extends Contract<TEndpoint, TValidator>,
  TProcedure,
  TEndpoints extends Record<TContract["endpoint"], TProcedure>,
>(
  endpoints: TEndpoints,
) => endpoints;

export const hypermedia = {
  contract,
  endpoint,
  response,
  createAction,
  routeEndpoints,
};
