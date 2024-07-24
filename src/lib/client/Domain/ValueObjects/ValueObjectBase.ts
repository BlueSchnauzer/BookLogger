/**ValueObjectのベースクラス
 * C#みたいに正確に型を測れないので不十分な実装。
 */
export abstract class ValueObjectsBase<T> {
  constructor(public readonly value: T) {
    this.validate(value);
    this.value = this.convertValue(value);
  }

  /**生成時のバリデーション */
  protected abstract validate(value: T): void;

  /**生成時に引数の値をValueObjectに合うように変換する */
  protected convertValue(value: T): T {
    return value;
  }
  
  /**保持する値が同一か
   * 判定条件はValueObjectごとに定義する。
   */
  public equals(vo: ValueObjectsBase<T>): boolean {
    if (vo === undefined || vo === null) {
      return false;
    }

    return this.equalsCore(vo);
  }

  /**保持する値が同一かを判定する、ValueObjectごとの定義 */
  protected abstract equalsCore(vo: ValueObjectsBase<T>): boolean;
}