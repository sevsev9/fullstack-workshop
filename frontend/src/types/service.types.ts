export type ServiceResult<T> = ServiceSuccess<T> | ServiceError;
export type PutServiceResult<T> =
  | ServiceSuccess<{
      message: string;
      updates: T;
    }>
  | ServiceError;

type ServiceSuccess<T> = {
  success: true;
  data: T;
};

type ServiceError = {
  success: false;
  message: string;
};
