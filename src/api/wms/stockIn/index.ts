import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { StockInVO, StockInForm, StockInQuery } from '@/api/wms/stockIn/types';

/**
 * 查询入库管理列表
 * @param query
 * @returns {*}
 */

export const listStockIn = (query?: StockInQuery): AxiosPromise<StockInVO[]> => {
  return request({
    url: '/wms/stockIn/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询入库管理详细
 * @param id
 */
export const getStockIn = (id: string | number): AxiosPromise<StockInVO> => {
  return request({
    url: '/wms/stockIn/' + id,
    method: 'get'
  });
};

/**
 * 新增入库管理
 * @param data
 */
export const addStockIn = (data: StockInForm) => {
  return request({
    url: '/wms/stockIn',
    method: 'post',
    data: data
  });
};

/**
 * 修改入库管理
 * @param data
 */
export const updateStockIn = (data: StockInForm) => {
  return request({
    url: '/wms/stockIn',
    method: 'put',
    data: data
  });
};

/**
 * 删除入库管理
 * @param id
 */
export const delStockIn = (id: string | number | Array<string | number>) => {
  return request({
    url: '/wms/stockIn/' + id,
    method: 'delete'
  });
};
