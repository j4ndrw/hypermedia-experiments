import { publicProcedure } from "./trpc";

export const hypermedia = {
  endpoint: <
    TEndpoint extends string,
    TValidator extends Parameters<typeof publicProcedure.input>[0] | undefined,
    TProcedure,
  >(
    endpoint: TEndpoint,
    options:
      | {
        procedure: () => TProcedure;
      }
      | {
        validator: TValidator;
        procedure: (validator: TValidator) => TProcedure;
      },
  ) => {
    const procedure = (() => {
      if (!("validator" in options)) return options.procedure();
      return options.procedure(options.validator);
    })();

    const validator = "validator" in options ? options.validator : undefined;
    return { endpoint, validator, procedure };
  },
  response: <
    TData,
    TAction extends Readonly<{
      [action: string]: Record<string, unknown>;
    }>,
  >(
    data: TData,
    actions: TAction,
  ) => ({ data, actions }),
};
