export class Profile {
  constructor(
    public readonly userId: string,
    public name: string,
    public gender: 'male' | 'female' | 'other',
    public birthday: Date,
    public horoscope: string,
    public zodiac: string,
    public weight?: number,
    public height?: number,
  ) {}

  static calculateZodiac(birthday: Date): string {
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return 'Pisces';

    return 'Unknown';
  }

  static calculateHoroscope(birthday: Date): string {
    const month = birthday.getMonth() + 1;
    return month === 1
      ? 'Capricorn'
      : month === 2
        ? 'Aquarius'
        : month === 3
          ? 'Pisces'
          : month === 4
            ? 'Aries'
            : month === 5
              ? 'Taurus'
              : month === 6
                ? 'Gemini'
                : month === 7
                  ? 'Cancer'
                  : month === 8
                    ? 'Leo'
                    : month === 9
                      ? 'Virgo'
                      : month === 10
                        ? 'Libra'
                        : month === 11
                          ? 'Scorpio'
                          : 'Sagittarius';
  }

  isValidBodyMetrics(): boolean {
    const validWeight = this.weight
      ? this.weight > 0 && this.weight < 300
      : true;
    const validHeight = this.height
      ? this.height > 0 && this.height < 250
      : true;
    return validWeight && validHeight;
  }
}
