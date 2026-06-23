export interface StockOutVO {
  /**
   *
   */
  id: string | number;

  /**
   * 商品ID
   */
  productId: string | number;

  /*
   *商品名称
   */
  productName: string;

  /**
   * 出库数量
   */
  quantity: number;

  /**
   * 客户
   */
  customer: string;

  /**
   *
   */
  remark: string;
}

export interface StockOutForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;

  /**
   * 商品ID
   */
  productId?: string | number;

  productName?: string;

  /**
   * 出库数量
   */
  quantity?: number;

  /**
   * 客户
   */
  customer?: string;

  /**
   *
   */
  remark?: string;
}

export interface StockOutQuery extends PageQuery {
  /**
   * 商品ID
   */
  productId?: string | number;

  /**
   * 商品名称
   */
  productName?: string | number;

  /**
   * 出库数量
   */
  quantity?: number;

  /**
   * 客户
   */
  customer?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
