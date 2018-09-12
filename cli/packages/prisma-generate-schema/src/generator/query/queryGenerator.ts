import { RootGenerator, FieldConfigUtils } from "../generator"
import { IGQLType } from "../../datamodel/model"
import { GraphQLObjectType, IGQLField, GraphQLID, GraphQLFieldConfigMap, GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"
import { plural, camelCase } from '../../util/util'

export default class QueryGenerator extends RootGenerator {
  public getTypeName(input: IGQLType[], args: {}) {
    return 'Query'
  }
  protected generateInternal(input: IGQLType[], args: {}) {
    const fieldMaps = input.filter(type => !type.isEnum).map(type => 
      FieldConfigUtils.merge(
        this.generateOneQueryField(type),
        this.generateManyQueryField(type)
      )
    )
    return new GraphQLObjectType({
      name: this.getTypeName(input, args),
      fields: FieldConfigUtils.merge(...fieldMaps, this.getNodeField())
    })
  }

  private getNodeField() {
    const fields = {} as GraphQLFieldConfigMap
    fields.node = {
      type: this.generators.node.generate(null, {}),
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) }
      }
    }
    return fields
  }
 
  private generateOneQueryField(model: IGQLType) {
    const fields = {} as GraphQLFieldConfigMap

    if(this.generators.uniqueQueryArguments.wouldBeEmpty(model, {})) {
      return fields
    }

    fields[camelCase(model.name)] = {
      type: this.generators.model.generate(model, {}),
      args: this.generators.uniqueQueryArguments.generate(model, {})
    }
    
    return fields
  }
 
  private generateManyQueryField(model: IGQLType) {
    const fields = {} as GraphQLFieldConfigMap

    fields[camelCase(plural(model.name))] = {
      type: new GraphQLNonNull(new GraphQLList(this.generators.model.generate(model, {}))),
      args: this.generators.manyQueryArguments.generate(model, {})
    }
    fields[`${camelCase(plural(model.name))}Connection`] = {
      type: new GraphQLNonNull(this.generators.modelConnection.generate(model, {})),
      args: this.generators.manyQueryArguments.generate(model, {})
    }

    return fields
  }
}