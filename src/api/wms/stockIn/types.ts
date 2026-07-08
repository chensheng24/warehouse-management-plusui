export interface StockInVO {
  /**
   *
   */
  id: string | number;

  /**
   * 商品ID
   */
  productId: string | number;

  /**
   * 商品名称
   */

  productName: string;
  /**
   * 入库数量
   */
  quantity: number;

  /**
   * 供应商
   */
  supplier: string;

  /**
   * 备注
   */
  remark: string;
}

export interface StockInForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;

  /**
   * 入库单据
   */
  stockInNo?: string | number;

  /**
   * 商品ID
   */
  productId?: string | number;

  /**
   * 商品名称
   */
  productName?: string;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 供应商
   */
  supplier?: string;

  /**
   *
   */
  remark?: string;

  stockInTime?: string;
}

export interface StockInQuery extends PageQuery {
  /**
   *
   */
  id?: string | number;

  /**
   * 入库单据
   */
  stockInNo?: string | number;

  /**
   * 商品ID
   */
  productId?: string | number;

  /**
   * 商品名称
   */
  productName?: string;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 供应商
   */
  supplier?: string;

  /**
   *
   */
  remark?: string;
  /**
   * 入库时间
   */
  stockInTime: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
