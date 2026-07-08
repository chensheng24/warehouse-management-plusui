export interface StockRecordVO {
  /**
   *
   */
  id: string | number;

  /**
   * 商品ID
   */
  productId: string | number;

  /**
   * 变动类型(IN/OUT)
   */
  changeType: string;

  /**
   * 变动数量
   */
  quantity: number;

  /**
   * 变动前库存
   */
  beforeQty: number;

  /**
   * 变动后库存
   */
  afterQty: number;

  /**
   * 业务ID(入库/出库单ID)
   */
  bizId: string | number;

  /**
   * 业务类型(STOCK_IN/STOCK_OUT)
   */
  bizType: string;

  /**
   * 操作人
   */
  operator: string;
}

export interface StockRecordForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;

  /**
   * 商品ID
   */
  productId?: string | number;

  /**
   * 变动类型(IN/OUT)
   */
  changeType?: string;

  /**
   * 变动数量
   */
  quantity?: number;

  /**
   * 变动前库存
   */
  beforeQty?: number;

  /**
   * 变动后库存
   */
  afterQty?: number;

  /**
   * 业务ID(入库/出库单ID)
   */
  bizId?: string | number;

  /**
   * 业务类型(STOCK_IN/STOCK_OUT)
   */
  bizType?: string;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 操作人
   */
  operator?: string;
}

export interface StockRecordQuery extends PageQuery {
  /**
   * 单据编号
   */
  recordNo?: string;

  /**
   * 商品ID
   */
  productId?: string | number;

  /**
   * 商品名称
   */
  productName?: string | number;

  /**
   * 变动类型(IN/OUT)
   */
  changeType?: string;

  /**
   * 变动数量
   */
  quantity?: number;

  /**
   * 变动前库存
   */
  beforeQty?: number;

  /**
   * 变动后库存
   */
  afterQty?: number;

  /**
   * 业务ID(入库/出库单ID)
   */
  bizId?: string | number;

  /**
   * 业务类型(STOCK_IN/STOCK_OUT)
   */
  bizType?: string;

  /**
   * 操作人
   */
  operator?: string;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 业务日期
   */
  businessTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
