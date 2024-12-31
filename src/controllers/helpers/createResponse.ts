import { IResponse } from '@/models/IResponse';

export const createResponse = (data: any, error: any = null): IResponse => ({
  success: !error,
  data,
  error,
});
