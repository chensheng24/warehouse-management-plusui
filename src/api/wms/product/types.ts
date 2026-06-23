export interface ProductVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 商品编码
   */
  productCode: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 分类
   */
  category: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 库存数量
   */
  stockQty: number;

}

export interface ProductForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 商品编码
   */
  productCode?: string;

  /**
   * 商品名称
   */
  productName?: string;

  /**
   * 分类
   */
  category?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 库存数量
   */
  stockQty?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface ProductQuery extends PageQuery {

  /**
   * 
   */
  id?: string | number;

  /**
   * 商品编码
   */
  productCode?: string;

  /**
   * 商品名称
   */
  productName?: string;

  /**
   * 分类
   */
  category?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 库存数量
   */
  stockQty?: number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
