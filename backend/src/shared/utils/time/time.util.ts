export class TimeUtil {
  static minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }

  static hoursToSeconds(hours: number): number {
    return hours * 60 * 60;
  }

  static daysToSeconds(days: number): number {
    return days * 24 * 60 * 60;
  }

  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
