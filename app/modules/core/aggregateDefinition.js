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
        var fact = new Fact(factName);
        factDefinitions.push(new ModelDefinitionPair(fact, definition[i]));
        this.facts.push(fact);
        dictionary[factName] = FACT;
        if (definition[i]["root"] === true) this.aggregate = fact;
      }
      if (null != enumName) {
        this.enums.push(new Enum(definition[i]));
        dictionary[enumName] = ENUM;
      }
      if (null != dimensionName) {
        var dimension = new Dimension(dimensionName, definition[i]);
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

var Fact = (function () {
  function Fact(name) {
    this.name = name;
    this.facts = [];
    this.dimensions = [];
    this.enums = [];
    this.fields = {};
  }

  Fact.prototype.hasName = function (name) {
    return this.name === name;
  };

  Fact.prototype.addFact = function (fact) {
    return this.facts.push(fact);
  };

  Fact.prototype.addDimension = function (dimension) {
    return this.dimensions.push(dimension);
  };

  Fact.prototype.addEnum = function (enumeration) {
    return this.enums.push(enumeration);
  };

  Fact.prototype.addField = function (field, fieldType) {
    return this.fields[field] = fieldType;
  };

  Fact.prototype.hasFactByName = function (factName) {
    return hasItemByName(this.facts, factName);
  };

  Fact.prototype.hasEnumByName = function (enumName) {
    return hasItemByName(this.enums, enumName);
  };

  Fact.prototype.hasFieldByName = function (fieldName) {
    return this.fields[fieldName] !== undefined;
  };

  Fact.prototype.fieldNames = function () {
    return Object.keys(this.fields);
  };

  return Fact;
})();

var Enum = (function () {
  function Enum(definition) {
    this.name = definition["enum"];
    this.values = definition["values"];
  }

  Enum.prototype.hasName = function (name) {
    return this.name === name;
  };

  return Enum;
})();

var Dimension = (function () {
  function Dimension(name, definition) {
    this.name = name;
    this.values = definition["values"];
  }

  Dimension.prototype.hasName = function (name) {
    return this.name === name;
  };

  Dimension.prototype.setParent = function (parentDimension) {
    this.parent = parentDimension;
  };

  Dimension.prototype.hasParentByName = function (parentName) {
    return this.parent.hasName(parentName);
  };

  return Dimension;
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