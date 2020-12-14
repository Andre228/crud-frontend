

export class DateTimeHelper {


  constructor() {}

  static setRightDateInObject(object, propsNames = []) {

    let strdate;
    let date;

    for (let i = 0; i < propsNames.length; i++) {
      strdate = object[propsNames[i]].toString();
      date = strdate.substr(0, strdate.length - 10).replace('T', ' ');
      object[propsNames[i]] = date;
    }
  }

  static setToValidDateFormat(object, prop) {
    let date = object[prop].toString().replace(' ', 'T');
    object[prop] = date;
  }

  static isValidStartAndEndDates(startDate: Date, endDate: Date): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.getTime() > end.getTime()) {
      return false;
    }
    return true;
  }

  static isExpired(date: Date): boolean {
    const now = new Date();
    const compareDate = new Date(date);
    if (compareDate && now) {
      if (compareDate.getTime() < now.getTime()) {
        return false;
      }
    }
    return true;
  }
}
