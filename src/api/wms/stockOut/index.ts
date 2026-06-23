import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { StockOutVO, StockOutForm, StockOutQuery } from '@/api/wms/stockOut/types';

/**
 * 查询出库管理列表
 * @param query
 * @returns {*}
 */

export const listStockOut = (query?: StockOutQuery): AxiosPromise<StockOutVO[]> => {
  return request({
    url: '/wms/stockOut/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询出库管理详细
 * @param id
 */
export const getStockOut = (id: string | number): AxiosPromise<StockOutVO> => {
  return request({
    url: '/wms/stockOut/' + id,
    method: 'get'
  });
};

/**
 * 新增出库管理
 * @param data
 */
export const addStockOut = (data: StockOutForm) => {
  return request({
    url: '/wms/stockOut',
    method: 'post',
    data: data
  });
};

/**
 * 修改出库管理
 * @param data
 */
export const updateStockOut = (data: StockOutForm) => {
  return request({
    url: '/wms/stockOut',
    method: 'put',
    data: data
  });
};

/**
 * 删除出库管理
 * @param id
 */
export const delStockOut = (id: string | number | Array<string | number>) => {
  return request({
    url: '/wms/stockOut/' + id,
    method: 'delete'
  });
};
