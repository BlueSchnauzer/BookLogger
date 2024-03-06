/**ValueObjectのベースクラス
 * C#みたいに正確に型を測れないので不十分な実装。
 */
export abstract class ValueObjectsBase<T> {
  constructor(public readonly value: T) {
    this.validate(value);
    this.value = value;
  }

  /**生成時のバリデーション */
  abstract validate(value: T): void;
  
  /**保持する値が同一か
   * 判定条件はValueObjectごとに定義する。
   */
  equals(vo: ValueObjectsBase<T>): boolean {
    if (vo === undefined || vo === null) {
      return false;
    }

    return this.equalsCore(vo);
  }

  /**保持する値が同一かを判定する、ValueObjectごとの定義 */
  abstract equalsCore(vo: ValueObjectsBase<T>): boolean;
}