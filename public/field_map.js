const ApageFieldMapping = {
  respondentName: "respondent.name",
  respondentDepartment: "respondent.department",
  respondentPosition: "respondent.position",
  respondentPhone: "respondent.phone",
  respondentEmail: "respondent.email",
  companyName: "company.name",
  companyAddress: "company.address",
};

const BpageFieldMapping = {
  numberOfEmployees: "B1.numberOfEmployees",
  containerVehicleTotal: "B1.containerTransportation.containerVehicle.total",
  containerVehicleDirect: "B1.containerTransportation.containerVehicle.direct",
  containerVehicleConsigned: "B1.containerTransportation.containerVehicle.consigned",
  privateVehicle: "B1.containerTransportation.privateVehicle",
  annualRevenueTotal: "B1.annualRevenue.total",
  annualRevenueInland: "B1.annualRevenue.inland",

  "b2-total": "B2.total",
  "b2-road": "B2.road",
  "b2-rail": "B2.rail",

  "b3-under9-number": "B3.underTen.number",
  "b3-under9-percent": "B3.underTen.percentage",
  "b3-under100-number": "B3.underHundred.number",
  "b3-under100-percent": "B3.underHundred.percentage",
  "b3-over100-number": "B3.overHundred.number",

  "b5-same-day": "B5.sameDayPercentage",
  "b5-next-day": "B5.nextDayPercentage",
  "b5-within-a-week": "B5.withinAWeekPercentage",
  //   "b5-average": "B5.average",

  "b6-inland-sido": "B6.inlandOD.sido",
  "b6-inland-sigun": "B6.inlandOD.sigun",
  "b6-inland-gu": "B6.inlandOD.gu",
  "b6-inland-point": "B6.inlandOD.point",
  "b6-port-sido": "B6.portOD.sido",
  "b6-port-sigun": "B6.portOD.sigun",
  "b6-port-gu": "B6.portOD.gu",
  "b6-port-point": "B6.portOD.point",
  "b6-rail-inter-1": "B6.intermediate.railInter1",
  "b6-rail-inter-2": "B6.intermediate.railInter2",
  "b6-road-inter-sido": "B6.intermediate.road.sido",
  "b6-road-inter-sigun": "B6.intermediate.road.sigun",
  "b6-road-inter-gu": "B6.intermediate.road.gu",
  "b6-road-inter-point": "B6.intermediate.road.point",
  "b6-volume-total": "B6.annualTransportVolume.total",
  "b6-volume-export": "B6.annualTransportVolume.direction.export",
  "b6-volume-rail": "B6.annualTransportVolume.transport.rail",
};

const CpageFieldMapping = {};

export { ApageFieldMapping, BpageFieldMapping, CpageFieldMapping };
