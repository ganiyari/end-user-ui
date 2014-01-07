'use strict';

describe("aggregateDefinition", function () {
  beforeEach(module('core'));

  describe("AggregateDefinition", function () {
    it("Interpret aggregate definition", function () {
      var json = '[\
      {\
        "fact": "household",\
        "has": ["state", "district", "family number", "highest educational qualification", "electrical connection type", "eat from same chulah(boolean)",\
        "all member captured(boolean)", "member(many)", "income source"]\
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
      var aggregateDefinition = new AggregateDefinition(jsonObj);
      expect(aggregateDefinition.getEnums().length).toBe(2);
      expect(aggregateDefinition.getDimensions().length).toBe(4);

      var district = $.grep(aggregateDefinition.getDimensions(), function (e) {
        return e.hasName("district");
      })[0];
      expect(district.hasParentByName("state")).toBe(true);

      var household = $.grep(aggregateDefinition.getFacts(), function (e) {
        return e.hasName("household");
      })[0];
      expect(household.hasFactByName("member")).toBe(true);
      expect(household.hasEnumByName("electrical connection type")).toBe(true);
      expect(household.hasFieldByName("family number")).toBe(true);
    });
  });
});
