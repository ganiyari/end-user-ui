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
        var fieldName = fields[j].match(/(\w*\s*)*/)[0]
//        console.log(fieldName + "---->" + dictionary[fields[j]]);
        switch (dictionary[fieldName]) {
          case FACT :
            var matchedFacts = $.grep(factDefinitions, function (e) {
              return e.getModel().hasName(fieldName);
            });
            currentFact.addFact(matchedFacts[0].getModel());
            break;
          case DIMENSION :
            break;
          case ENUM :
            break;
          default :
            break;
        }
      }
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

  return AggregateDefinition;
})();

var Fact = (function () {
  function Fact(name) {
    this.name = name;
    this.facts = [];
  }

  Fact.prototype.hasName = function (name) {
    return this.name === name;
  };

  Fact.prototype.addFact = function (fact) {
    return this.facts.push(fact);
  };

  Fact.prototype.hasFactByName = function (factName) {
    var matchingFacts = $.grep(this.facts, function (e) {
      return e.hasName(factName);
    });
    return matchingFacts.length == 1;
  };

  return Fact;
})();

var Enum = (function () {
  function Enum(definition) {
    this.name = definition["enum"];
    this.values = definition["values"];
  }

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