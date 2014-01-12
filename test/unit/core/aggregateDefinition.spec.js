'use strict';

describe("core", function () {
  beforeEach(module('core'));

  var json = '[\
      {\
        "fact": "household",\
        "has": ["state", "district", "family number", "highest educational qualification", "electrical connection type", "eat from same chulah(boolean)",\
        "all member captured(boolean)", "member(many)", "income source"],\
        \"root" : true\
      },\
      {\
        "fact": "member",\
        "has": ["name", "gender", "relationship", "blood pressure", "age(number)", "weight(mass)", "height(length)"]\
      },\
      {\
        "enum": "income source",\
        "values": ["a", "b"]\
      },\
      {\
        "enum": "electrical connection type",\
        "values": ["a", "b"]\
      },\
      {\
        "dimension": "state"\
      },\
      {\
        "dimension": "district",\
        "has": "state"\
      },\
      {\
        "dimension": "gender"\
      },\
      {\
        "dimension": "caste",\
        "values": ["Baiga", "Birhor", "Others"]\
      }\
      ]';
  var jsonObj = JSON.parse(json);

  describe("FactDefinition", function() {
    it("should get field names", function () {
      var fact = new FactDefinition("foo");
      fact.addField("abc", "(boolean)");
      fact.addField("xyz", "(string)");

      expect(fact.fieldNames().length).toBe(2);
    });

    it("should get field types", function () {
      var fact = new FactDefinition("foo");
      fact.addField("abc", "(boolean)");
      fact.addField("xyz", "(string)");
      expect(fact.isFieldBoolean("abc")).toBe(true);
      expect(fact.isFieldBoolean("xyz")).toBe(false);
      expect(fact.isFieldString("xyz")).toBe(true);
      expect(fact.isFieldString("abc")).toBe(false);
    });

    it("should create new instance", function () {
      var fact = new FactDefinition("foo");
      fact.addField("abc", "(boolean)");
      fact.addField("xyz", "(string)");

      var instance = fact.newInstance();
      expect(instance).toBeDefined();
      expect(instance["fields"]["abc"]).toBeDefined(null);
      expect(instance["fields"]["abc"]).toBe(null);
    });
  });

  describe("AggregateModel", function () {
    it("should interpret aggregate definition", function () {
      var aggregateModel = new AggregateModel(jsonObj);
      var household = aggregateModel.getAggregate();
      expect(household.hasName("household")).toBe(true);
      expect(aggregateModel.getEnums().length).toBe(2);
      expect(aggregateModel.getEnum("income source").getValues().length).toBe(2);
      expect(aggregateModel.getDimensions().length).toBe(4);

      var district = $.grep(aggregateModel.getDimensions(), function (e) {
        return e.hasName("district");
      })[0];
      expect(district.hasParentByName("state")).toBe(true);

      expect(household.hasFactByName("member")).toBe(true);
      expect(household.hasEnumByName("electrical connection type")).toBe(true);
      expect(household.hasFieldByName("family number")).toBe(true);
      expect(household.isFieldBoolean("eat from same chulah")).toBe(true);
    });
  });

  describe("AggregateModelNavigator", function () {
    it("should get the next fact", function () {
      var aggregateModel = new AggregateModel(jsonObj);
      var modelNavigator = new ModelNavigator(aggregateModel);
      console.log(modelNavigator.getCurrentFact().isFieldFact("member"));
      expect(modelNavigator.nextFact("member")).toBe(true);
    });
  });
});