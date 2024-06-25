export type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

type ServiceSuccess<T> = {
  success: true;
  data: T;
};

type ServiceError = {
  success: false;
  message: string;
};
