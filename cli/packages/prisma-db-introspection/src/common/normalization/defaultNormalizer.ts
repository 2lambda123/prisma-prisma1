import NormalizerGroup from './normalizerGroup'
import ModelNameAndDirectiveNormalizer from './modelNameAndDirectiveNormalizer'
import ModelOrderNormalizer from './modelOrderNormalizer'
import { ISDL, DatabaseType } from 'prisma-datamodel'
import { HideReservedFields } from './hideReservedFields'
import { RemoveRelationName } from './removeRelationNames'
import { RemoveBackRelation } from './removeBackRelations'
import { AdjustJoinTableCardinality } from './adjustJoinTableCardinality'
import { CopyEnums } from './copyEnums'

export default abstract class DefaultNormalizer {
  public static create(databaseType: DatabaseType, baseModel: ISDL | null) {
    if (baseModel === null) {
      return this.createWithoutBaseModel(databaseType)
    } else {
      return this.createWithBaseModel(databaseType, baseModel)
    }
  }

  public static createWithoutBaseModel(databaseType: DatabaseType) {
    if (databaseType === DatabaseType.mongo) {
      // Document normalization
      return new NormalizerGroup([
        new ModelNameAndDirectiveNormalizer(null),
        new RemoveRelationName(null),
        new ModelOrderNormalizer(null),
      ])
    } else {
      // Relational normalization
      return new NormalizerGroup([
        new ModelNameAndDirectiveNormalizer(null),
        new RemoveRelationName(null),
        new ModelOrderNormalizer(null),
      ])
    }
  }

  public static createWithBaseModel(
    databaseType: DatabaseType,
    baseModel: ISDL,
  ) {
    if (databaseType === DatabaseType.mongo) {
      // Document normalization with base model
      return new NormalizerGroup([
        new CopyEnums(baseModel),
        new RemoveRelationName(baseModel),
        new ModelNameAndDirectiveNormalizer(baseModel),
        new ModelOrderNormalizer(baseModel),
        new RemoveBackRelation(baseModel),
      ])
    } else {
      // Relational normalization with base model
      return new NormalizerGroup([
        new CopyEnums(baseModel),
        new RemoveRelationName(baseModel),
        new ModelNameAndDirectiveNormalizer(baseModel),
        new ModelOrderNormalizer(baseModel),
        new HideReservedFields(baseModel),
        new AdjustJoinTableCardinality(baseModel),
        new RemoveBackRelation(baseModel),
      ])
    }
  }
}
