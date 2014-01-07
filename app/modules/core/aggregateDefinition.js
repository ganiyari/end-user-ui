'use strict';

var AggregateDefinition = (function () {
  function AggregateDefinition(definition) {
    var FACT = "FACT", DIMENSION = "DIMENSION", ENUM = "ENUM";
    var factDefinitions = [];
    var dimensionDefinitions = [];
    var dictionary = {};

    this.enums = [];
    this.dimensions = [];
    this.facts = [];

    for (var i = 0; i < definition.length; i++) {
      var factName = definition[i]["fact"];
      var enumName = definition[i]["enum"];
      var dimensionName = definition[i]["dimension"];

      if (null != factName) {
        var fact = new FactDefinition(factName);
        factDefinitions.push(new ModelDefinitionPair(fact, definition[i]));
        this.facts.push(fact);
        dictionary[factName] = FACT;
        if (definition[i]["root"] === true) this.aggregate = fact;
      }
      if (null != enumName) {
        this.enums.push(new EnumDefinition(definition[i]));
        dictionary[enumName] = ENUM;
      }
      if (null != dimensionName) {
        var dimension = new DimensionDefinition(dimensionName, definition[i]);
        dimensionDefinitions.push(new ModelDefinitionPair(dimension, definition[i]));
        this.dimensions.push(dimension);
        dictionary[dimensionName] = DIMENSION;
      }
    }

    for (i = 0; i < dimensionDefinitions.length; i++) {
      var matchedDimensionDefinition = [], relationship = dimensionDefinitions[i].getDefinition()["has"];
      if (null != relationship) {
        matchedDimensionDefinition = $.grep(dimensionDefinitions, function (e) {
          return e.getModel().hasName(relationship);
        });
      }
      if (matchedDimensionDefinition.length != 0) {
        dimensionDefinitions[i].getModel().setParent(matchedDimensionDefinition[0].getModel());
      }
    }

    for (i = 0; i < factDefinitions.length; i++) {
      var fields = factDefinitions[i].getDefinition()["has"];
      var currentFact = factDefinitions[i].getModel();
      for (var j = 0; j < fields.length; j++) {
        var fieldName = fields[j].match(/(\w*\s*)*/)[0];
        switch (dictionary[fieldName]) {
          case FACT :
            currentFact.addFact(matchByFieldName(factDefinitions, fieldName));
            break;
          case DIMENSION :
            currentFact.addDimension(matchByFieldName(dimensionDefinitions, fieldName));
            break;
          case ENUM :
            $.grep(this.enums, function (e) {
              return e.hasName(fieldName);
            });
            currentFact.addEnum(getItemsByName(this.enums, fieldName)[0]);
            break;
          default :
            var fieldType = fields[j].match(/\50\w*\51/);
            fieldType = (fieldType == null) ? "(string)" : fieldType;
            currentFact.addField(fieldName, fieldType);
            break;
        }
      }
    }

    function matchByFieldName(definitions, fieldName) {
      var matchedItems = $.grep(definitions, function (e) {
        return e.getModel().hasName(fieldName);
      });
      return matchedItems[0].getModel();
    }
  }

  AggregateDefinition.prototype.getEnums = function () {
    return this.enums;
  };

  AggregateDefinition.prototype.getDimensions = function () {
    return this.dimensions;
  };

  AggregateDefinition.prototype.getFacts = function () {
    return this.facts;
  };

  AggregateDefinition.prototype.getAggregate = function() {
    return this.aggregate;
  };

  return AggregateDefinition;
})();

function getItemsByName(arrayObj, name) {
  return $.grep(arrayObj, function (e) {
    return e.hasName(name);
  });
}

function hasItemByName(arrayObj, name) {
  return getItemsByName(arrayObj, name).length == 1;
}

var FactDefinition = (function () {
  function FactDefinition(name) {
    this.name = name;
    this.facts = [];
    this.dimensions = [];
    this.enums = [];
    this.fields = {};
  }

  FactDefinition.prototype.hasName = function (name) {
    return this.name === name;
  };

  FactDefinition.prototype.addFact = function (fact) {
    return this.facts.push(fact);
  };

  FactDefinition.prototype.addDimension = function (dimension) {
    return this.dimensions.push(dimension);
  };

  FactDefinition.prototype.addEnum = function (enumeration) {
    return this.enums.push(enumeration);
  };

  FactDefinition.prototype.addField = function (field, fieldType) {
    return this.fields[field] = fieldType;
  };

  FactDefinition.prototype.hasFactByName = function (factName) {
    return hasItemByName(this.facts, factName);
  };

  FactDefinition.prototype.hasEnumByName = function (enumName) {
    return hasItemByName(this.enums, enumName);
  };

  FactDefinition.prototype.hasFieldByName = function (fieldName) {
    return this.fields[fieldName] !== undefined;
  };

  FactDefinition.prototype.fieldNames = function () {
    return Object.keys(this.fields);
  };

  return FactDefinition;
})();

var EnumDefinition = (function () {
  function EnumDefinition(definition) {
    this.name = definition["enum"];
    this.values = definition["values"];
  }

  EnumDefinition.prototype.hasName = function (name) {
    return this.name === name;
  };

  return EnumDefinition;
})();

var DimensionDefinition = (function () {
  function DimensionDefinition(name, definition) {
    this.name = name;
    this.values = definition["values"];
  }

  DimensionDefinition.prototype.hasName = function (name) {
    return this.name === name;
  };

  DimensionDefinition.prototype.setParent = function (parentDimension) {
    this.parent = parentDimension;
  };

  DimensionDefinition.prototype.hasParentByName = function (parentName) {
    return this.parent.hasName(parentName);
  };

  return DimensionDefinition;
})();

var ModelDefinitionPair = (function () {
  function ModelDefinitionPair(model, definition) {
    this.model = model;
    this.definition = definition;
  }

  ModelDefinitionPair.prototype.getModel = function () {
    return this.model;
  };

  ModelDefinitionPair.prototype.getDefinition = function () {
    return this.definition;
  };

  return ModelDefinitionPair;
})();

//a.match(/\50\w*\51/)