import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductVO, ProductForm, ProductQuery } from '@/api/wms/product/types';

/**
 * 查询商品列表
 * @param query
 * @returns {*}
 */

export const listProduct = (query?: ProductQuery): AxiosPromise<ProductVO[]> => {
  return request({
    url: '/wms/product/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品详细
 * @param id
 */
export const getProduct = (id: string | number): AxiosPromise<ProductVO> => {
  return request({
    url: '/wms/product/' + id,
    method: 'get'
  });
};

/**
 * 新增商品
 * @param data
 */
export const addProduct = (data: ProductForm) => {
  return request({
    url: '/wms/product',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品
 * @param data
 */
export const updateProduct = (data: ProductForm) => {
  return request({
    url: '/wms/product',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品
 * @param id
 */
export const delProduct = (id: string | number | Array<string | number>) => {
  return request({
    url: '/wms/product/' + id,
    method: 'delete'
  });
};
