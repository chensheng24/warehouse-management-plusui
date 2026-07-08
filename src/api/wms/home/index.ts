import request from '@/utils/request';
import { AxiosPromise } from 'axios';
export function getHomeStats() {
  return request({
    url: '/wms/home/stats',
    method: 'get'
  });
}

export function getRecentRecords() {
  return request({
    url: '/wms/home/recent',
    method: 'get'
  });
}

export function getLowStock() {
  return request({
    url: '/wms/home/lowStock',
    method: 'get'
  });
}
