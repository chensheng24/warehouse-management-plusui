import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { StockRecordVO, StockRecordForm, StockRecordQuery } from '@/api/wms/stockRecord/types';

/**
 * 查询库存流水列表
 * @param query
 * @returns {*}
 */

export const listStockRecord = (query?: StockRecordQuery): AxiosPromise<StockRecordVO[]> => {
  return request({
    url: '/wms/stockRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询库存流水详细
 * @param id
 */
export const getStockRecord = (id: string | number): AxiosPromise<StockRecordVO> => {
  return request({
    url: '/wms/stockRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增库存流水
 * @param data
 */
export const addStockRecord = (data: StockRecordForm) => {
  return request({
    url: '/wms/stockRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改库存流水
 * @param data
 */
export const updateStockRecord = (data: StockRecordForm) => {
  return request({
    url: '/wms/stockRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除库存流水
 * @param id
 */
export const delStockRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/wms/stockRecord/' + id,
    method: 'delete'
  });
};
